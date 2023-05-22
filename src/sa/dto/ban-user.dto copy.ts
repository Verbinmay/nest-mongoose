import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BanUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value.trim())
  @MinLength(20)
  banReason: string;
}
