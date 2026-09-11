import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email debe ser un correo valido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
