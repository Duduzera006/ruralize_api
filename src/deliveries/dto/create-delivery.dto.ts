import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum DeliveryStatus {
  PENDENTE = 'PENDENTE',
  EM_TRANSITO = 'EM_TRANSITO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  empresaId: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsString()
  @IsNotEmpty()
  prazo: string;

  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus = DeliveryStatus.PENDENTE;

  @IsString()
  @IsOptional()
  clienteNome?: string;
}
