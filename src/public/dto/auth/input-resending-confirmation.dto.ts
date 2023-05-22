import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendingConfirmation {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }): string => value.trim())
  email: string;
}
