import { IsString } from 'class-validator';
import { isValidCnpj } from '../../helpers/isValidCNPJ.decorator.js';

export class LoginDto {
  @isValidCnpj()
  cnpj: string;

  @IsString()
  password: string;
}
