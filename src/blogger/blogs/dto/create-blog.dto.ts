import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @Transform(({ value }): string => value.trim())
  public name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }): string => value.trim())
  public description: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(100)
  @Transform(({ value }): string => value.trim())
  public websiteUrl: string;
}
