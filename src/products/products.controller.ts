import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('/empresa/:empresaId')
  findAll(@Param('empresaId') empresaId: string) {
    return this.productsService.findAll(empresaId);
  }

  @Get(':empresaId/:produtoId')
  findOne(@Param('empresaId') empresaId: string, @Param('produtoId') produtoId: string) {
    return this.productsService.findOne(empresaId, produtoId);
  }

  @Get('/totalVendas/:empresaId')
  getTotalSales(@Param('empresaId') empresaId: string) {
    return this.productsService.getTotalSales(empresaId);
  }

  @Patch(':empresaId/:produtoId')
  update(
    @Param('empresaId') empresaId: string,
    @Param('produtoId') produtoId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(empresaId, produtoId, dto);
  }

  @Delete(':empresaId/:produtoId')
  remove(@Param('empresaId') empresaId: string, @Param('produtoId') produtoId: string) {
    return this.productsService.remove(empresaId, produtoId);
  }
}
