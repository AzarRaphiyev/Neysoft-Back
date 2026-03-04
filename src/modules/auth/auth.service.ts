import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  private transporter;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    // Email göndərmək üçün tənzimləmə (Gmail üçün)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'raphiyev@gmail.com', // Öz emailiniz
        pass: 'xxxx xxxx xxxx xxxx', // Gmail-dən aldığınız "App Password"
      },
    });
  }

  async register(dto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const vToken = uuidv4(); // Təsdiq üçün unikal ID

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        verificationToken: vToken,
      },
    });

    // Təsdiq linkini göndər
    const url = `http://localhost:3000/auth/verify?token=${vToken}`;
    await this.transporter.sendMail({
      to: user.email,
      subject: 'Neysoft - Hesabınızı Təsdiqləyin',
      html: `Hesabınızı təsdiqləmək üçün <a href="${url}">bura klikləyin</a>.`,
    });

    return { message: 'Qeydiyyat uğurludur. Zəhmət olmasa emailinizi yoxlayın.' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) throw new BadRequestException('Keçərsiz və ya müddəti bitmiş token.');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        isVerified: true, 
        verificationToken: null 
      },
    });

    return { message: 'Email uğurla təsdiqləndi! İndi giriş edə bilərsiniz.' };
  }

  async login(dto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username } });
    
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Məlumatlar yanlışdır.');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Zəhmət olmasa əvvəlcə emailinizi təsdiqləyin.');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: { username: user.username, role: user.role }
    };
  }
}