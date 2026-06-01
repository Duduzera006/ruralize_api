import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum NotificationType {
  INFO = 'INFO',
  ALERTA = 'ALERTA',
  SUCESSO = 'SUCESSO',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  empresaId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  mensagem: string;

  @IsEnum(NotificationType)
  @IsOptional()
  tipo?: NotificationType = NotificationType.INFO;
}
