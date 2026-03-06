import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(80, { message: 'O nome deve ter no máximo 80 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/(?=.*\d)/, { message: 'A senha deve conter pelo menos um número' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'A senha deve conter pelo menos um caractere especial',
  })
  password: string;
}
