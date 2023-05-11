import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class InputLogin {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value.trim())
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
