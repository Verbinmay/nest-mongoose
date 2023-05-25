import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { BanDto } from '../../../sa/dto/user/ban-user.dto copy';
import { ValidationBlogId } from '../../../validation/validationBlogId';

export class BanUserForBlogDto extends BanDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value.trim())
  @Validate(ValidationBlogId)
  public blogId: string;
}
