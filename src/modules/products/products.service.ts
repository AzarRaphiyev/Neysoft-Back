import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Barkodun unikal olub-olmadığını yoxlayırıq
    const existingProduct = await this.prisma.product.findUnique({
      where: { barcode: createProductDto.barcode },
    });

    if (existingProduct) {
      throw new BadRequestException('Bu barkod ilə məhsul artıq mövcuddur');
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        color: true,
        size: true,
        supplier: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        color: true,
        size: true,
        supplier: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Məhsul tapılmadı');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Məhsulun ümumiyyətlə mövcud olub-olmadığını yoxlayırıq
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Yeniləmək üçün məhsul tapılmadı');
    }

    // Əgər fərqli bir barkod göndərilibsə, onun unikal olub-olmadığını yoxlayırıq
    if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });

      if (existingProduct) {
        throw new BadRequestException('Bu barkod ilə artıq başqa məhsul mövcuddur');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Silmək üçün məhsul tapılmadı');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
