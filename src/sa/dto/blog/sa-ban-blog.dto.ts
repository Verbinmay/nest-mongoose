import { IsBoolean } from 'class-validator';

export class SABanBlogDto {
  @IsBoolean()
  isBanned: boolean;
}
