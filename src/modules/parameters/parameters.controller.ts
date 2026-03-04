import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ParametersService } from './parameters.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { CreateSizeDto } from './dto/create-size.dto';

@ApiTags('parameters')
@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  // --- KATEQORİYA (CATEGORY) ---
  @Post('category')
  @ApiOperation({ summary: 'Yeni kateqoriya əlavə et' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.parametersService.createCategory(createCategoryDto);
  }

  @Get('category')
  @ApiOperation({ summary: 'Bütün kateqoriyaları gətir' })
  getCategories() {
    return this.parametersService.getCategories();
  }

  @Delete('category/:id')
  @ApiOperation({ summary: 'Kateqoriyanı sil' })
  @ApiParam({ name: 'id', description: 'Kateqoriya ID-si' })
  deleteCategory(@Param('id') id: string) {
    return this.parametersService.deleteCategory(id);
  }

  // --- RƏNG (COLOR) ---
  @Post('color')
  @ApiOperation({ summary: 'Yeni rəng əlavə et' })
  createColor(@Body() createColorDto: CreateColorDto) {
    return this.parametersService.createColor(createColorDto);
  }

  @Get('color')
  @ApiOperation({ summary: 'Bütün rəngləri gətir' })
  getColors() {
    return this.parametersService.getColors();
  }

  @Delete('color/:id')
  @ApiOperation({ summary: 'Rəngi sil' })
  @ApiParam({ name: 'id', description: 'Rəng ID-si' })
  deleteColor(@Param('id') id: string) {
    return this.parametersService.deleteColor(id);
  }

  // --- ÖLÇÜ (SIZE) ---
  @Post('size')
  @ApiOperation({ summary: 'Yeni ölçü əlavə et' })
  createSize(@Body() createSizeDto: CreateSizeDto) {
    return this.parametersService.createSize(createSizeDto);
  }

  @Get('size')
  @ApiOperation({ summary: 'Bütün ölçüləri gətir' })
  getSizes() {
    return this.parametersService.getSizes();
  }

  @Delete('size/:id')
  @ApiOperation({ summary: 'Ölçünü sil' })
  @ApiParam({ name: 'id', description: 'Ölçü ID-si' })
  deleteSize(@Param('id') id: string) {
    return this.parametersService.deleteSize(id);
  }
}
