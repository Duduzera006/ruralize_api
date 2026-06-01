import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo produto' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos com filtros opcionais' })
  @ApiQuery({ name: 'titulo', required: false, description: 'Filtrar por nome do produto' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoria' })
  @ApiQuery({ name: 'empresaId', required: false, description: 'Filtrar por loja (empresa)' })
  getAllProducts(
    @Query('titulo') titulo?: string,
    @Query('categoria') categoria?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.productsService.getAllProducts({ titulo, categoria, empresaId });
  }

  @Get('/empresa/:empresaId')
  @ApiOperation({ summary: 'Listar produtos de uma empresa específica' })
  findAll(@Param('empresaId') empresaId: string) {
    return this.productsService.findAll(empresaId);
  }

  @Get(':empresaId/:produtoId')
  @ApiOperation({ summary: 'Obter detalhes de um produto' })
  findOne(@Param('empresaId') empresaId: string, @Param('produtoId') produtoId: string) {
    return this.productsService.findOne(empresaId, produtoId);
  }

  @Get('/totalVendas/:empresaId')
  @ApiOperation({ summary: 'Calcular valor total potencial do estoque' })
  getTotalSales(@Param('empresaId') empresaId: string) {
    return this.productsService.getTotalSales(empresaId);
  }

  @Patch(':empresaId/:produtoId')
  @ApiOperation({ summary: 'Atualizar um produto' })
  update(
    @Param('empresaId') empresaId: string,
    @Param('produtoId') produtoId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(empresaId, produtoId, dto);
  }

  @Delete(':empresaId/:produtoId')
  @ApiOperation({ summary: 'Remover um produto' })
  remove(@Param('empresaId') empresaId: string, @Param('produtoId') produtoId: string) {
    return this.productsService.remove(empresaId, produtoId);
  }
}
