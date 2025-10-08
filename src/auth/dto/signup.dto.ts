import { IsEmail, IsString, MinLength } from 'class-validator';
import { isValidCnpj } from '../../helpers/isValidCNPJ.decorator.js';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  displayName: string;

  @isValidCnpj()
  cnpj: string;
}
