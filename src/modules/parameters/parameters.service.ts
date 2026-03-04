import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { CreateSizeDto } from './dto/create-size.dto';

@Injectable()
export class ParametersService {
  constructor(private prisma: PrismaService) {}

  // --- KATEQORİYA (CATEGORY) ---
  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Bu adda kateqoriya artıq mövcuddur');
    }
    return this.prisma.category.create({ data: { name: dto.name } });
  }

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Kateqoriya tapılmadı');
    }
    return this.prisma.category.delete({ where: { id } });
  }

  // --- RƏNG (COLOR) ---
  async createColor(dto: CreateColorDto) {
    const existing = await this.prisma.color.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Bu adda rəng artıq mövcuddur');
    }
    return this.prisma.color.create({ data: { name: dto.name } });
  }

  async getColors() {
    return this.prisma.color.findMany();
  }

  async deleteColor(id: string) {
    const existing = await this.prisma.color.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Rəng tapılmadı');
    }
    return this.prisma.color.delete({ where: { id } });
  }

  // --- ÖLÇÜ (SIZE) ---
  async createSize(dto: CreateSizeDto) {
    const existing = await this.prisma.size.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Bu adda ölçü artıq mövcuddur');
    }
    return this.prisma.size.create({ data: { name: dto.name } });
  }

  async getSizes() {
    return this.prisma.size.findMany();
  }

  async deleteSize(id: string) {
    const existing = await this.prisma.size.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Ölçü tapılmadı');
    }
    return this.prisma.size.delete({ where: { id } });
  }
}
