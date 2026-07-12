import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(60)
  passwordHash: string;

  @IsEnum(Role)
  role: Role;
}
