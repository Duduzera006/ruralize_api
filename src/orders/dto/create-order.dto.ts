import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PagamentoMetodo = 'pix' | 'cartao' | 'boleto';
export type EntregaTipo = 'retirada' | 'entrega';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  titulo: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantidade: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precoUnitario: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsString()
  foto?: string | null;
}

export class PagamentoDto {
  @IsString()
  @IsEnum(['pix', 'cartao', 'boleto'] as any)
  metodo: PagamentoMetodo;

  @IsOptional()
  @IsString()
  transactionId?: string | null;
}

export class EntregaDto {
  @IsString()
  @IsEnum(['retirada', 'entrega'] as any)
  tipo: EntregaTipo;

  @IsOptional()
  @IsString()
  endereco?: string | null;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  empresaId: string;

  @IsOptional()
  @IsString()
  compradorId?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as any)
  status?: OrderStatus = 'pending';

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  total: number;

  @IsOptional()
  createdAt?: Date | any;

  @IsOptional()
  updatedAt?: Date | any;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => PagamentoDto)
  pagamento: PagamentoDto;

  @ValidateNested()
  @Type(() => EntregaDto)
  entrega: EntregaDto;
}
