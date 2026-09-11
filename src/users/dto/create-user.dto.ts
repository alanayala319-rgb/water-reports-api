import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEmail({}, { message: 'email debe ser un correo valido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'password debe tener al menos 8 caracteres' })
  @MaxLength(72) // limite practico de bcrypt
  password: string;

  @IsOptional()
  @IsBoolean()
  isNotificationEnabled?: boolean;
}
