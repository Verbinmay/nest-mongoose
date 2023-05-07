import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  public name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  public description: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  public websiteUrl: string;
}
