import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Response } from 'express'; // Şəkil (Buffer) qaytarmaq üçün əlavə edildi

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni məhsul əlavə etmək' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Bütün məhsulları gətirmək və filterləmək (Barkod, Ad və Stok)' })
  @ApiQuery({ name: 'search', required: false, description: 'Barkod və ya məhsulun adına görə axtarış' })
  @ApiQuery({ name: 'outOfStock', required: false, type: Boolean, description: 'Yalnız stoku "0" olan (bitən) məhsulları gətir' })
  findAll(
    @Query('search') search?: string,
    @Query('outOfStock') outOfStock?: string,
  ) {
    // Swagger-dən gələn dəyər string olduğu üçün onu boolean-a (true/false) çeviririk
    const isOutOfStock = outOfStock === 'true';
    return this.productsService.findAll(search, isOutOfStock);
  }

  // --- YENİ ƏLAVƏ EDİLƏN ŞTRİXKOD API-Sİ ---
  @Get('barcode/:code')
  @ApiOperation({ summary: 'Verilən koda uyğun qara-ağ ştrixkod şəkli (PNG) qaytarır' })
  async getBarcodeImage(@Param('code') code: string, @Res() res: Response) {
    const buffer = await this.productsService.generateBarcodeImage(code);
    
    // Brauzerə və ya frontendə bunun bir PNG şəkli olduğunu deyirik
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Qeyd edilmiş ID üzrə məhsulu əlaqəli məlumatlarla birlikdə gətirmək' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Qeyd edilmiş ID üzrə məhsulu yeniləmək' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Qeyd edilmiş ID üzrə məhsulu silmək' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}