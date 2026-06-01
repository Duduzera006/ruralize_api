import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar uma avaliação para um produto' })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get(':empresaId/:productId')
  @ApiOperation({ summary: 'Listar todas as avaliações de um produto' })
  findAllByProduct(@Param('empresaId') empresaId: string, @Param('productId') productId: string) {
    return this.reviewsService.findAllByProduct(empresaId, productId);
  }

  @Get(':empresaId/:productId/average')
  @ApiOperation({ summary: 'Obter a média de avaliação de um produto' })
  getAverageRating(@Param('empresaId') empresaId: string, @Param('productId') productId: string) {
    return this.reviewsService.getAverageRating(empresaId, productId);
  }
}
