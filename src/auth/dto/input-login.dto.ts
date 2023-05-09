import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class InputLogin {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  loginOrEmail: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password: string;
}
