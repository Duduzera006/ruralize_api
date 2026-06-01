import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID da empresa proprietária do produto' })
  @IsString()
  @IsNotEmpty()
  empresaId: string;

  @ApiProperty({ description: 'ID do produto sendo avaliado' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'ID do comprador que está avaliando' })
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty({ description: 'Nome do comprador para exibição' })
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty({ description: 'Nota de 1 a 5', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário da avaliação' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
