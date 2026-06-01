import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um produto aos favoritos' })
  add(@Body() dto: CreateFavoriteDto) {
    return this.favoritesService.add(dto);
  }

  @Get(':buyerId')
  @ApiOperation({ summary: 'Listar favoritos de um comprador' })
  findAll(@Param('buyerId') buyerId: string) {
    return this.favoritesService.findAll(buyerId);
  }

  @Delete(':buyerId/:productId')
  @ApiOperation({ summary: 'Remover um produto dos favoritos' })
  remove(@Param('buyerId') buyerId: string, @Param('productId') productId: string) {
    return this.favoritesService.remove(buyerId, productId);
  }
}
