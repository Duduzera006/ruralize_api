import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { isValidCnpj } from '../../helpers/isValidCNPJ.decorator.js';

export class UpdateUserDto {
  @IsString()
  uid: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @MinLength(6)
  @isValidCnpj()
  cnpj: string;
}
