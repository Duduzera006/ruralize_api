import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  fotos: string[];

  @IsNumber()
  @Min(0)
  preco: number;

  @IsNumber()
  @Min(0)
  estoque: number;

  @IsString()
  categoria: string;

  @IsString()
  ownerId: string;
}
