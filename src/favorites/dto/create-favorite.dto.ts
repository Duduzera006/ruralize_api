import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ description: 'ID do comprador' })
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty({ description: 'ID da empresa proprietária do produto' })
  @IsString()
  @IsNotEmpty()
  empresaId: string;

  @ApiProperty({ description: 'ID do produto' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
