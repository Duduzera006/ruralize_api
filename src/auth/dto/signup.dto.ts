import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { isValidCnpj } from '../../helpers/isValidCNPJ.decorator.js';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @isValidCnpj()
  cnpj?: string;
}
