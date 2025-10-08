import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (base: string, factors: number[]) =>
    base.split('').reduce((acc, digit, i) => acc + parseInt(digit) * factors[i], 0);

  const base = cnpj.slice(0, 12);
  const checkDigits = cnpj.slice(12);

  const factor1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = calc(base, factor1) % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;

  const factor2 = [6, ...factor1];
  let d2 = calc(base + d1, factor2) % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;

  return checkDigits === `${d1}${d2}`;
}

export function isValidCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCpfCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const cleaned = value.replace(/\D/g, '');
          return isValidCNPJ(cleaned);
        },
        defaultMessage() {
          return 'CNPJ inválido.';
        },
      },
    });
  };
}
