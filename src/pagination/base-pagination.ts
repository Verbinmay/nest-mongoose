import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class BasicPagination {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pageNumber = 1;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pageSize = 10;
  @IsString()
  @IsOptional()
  sortBy = 'createdAt';
  @IsString()
  @IsOptional()
  sortDirection: 'asc' | 'desc' = 'desc';

  public skip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  public sortFilter() {
    return { [this.sortBy]: this.sortDirection === 'desc' ? -1 : 1 };
  }
  public countPages(totalCount: number) {
    return Math.ceil(totalCount / this.pageSize);
  }
}

export class PaginationQuery extends BasicPagination {
  @IsString()
  @IsOptional()
  searchNameTerm = '';
  @IsString()
  @IsOptional()
  searchLoginTerm = '';
  @IsString()
  @IsOptional()
  searchEmailTerm = '';
  @IsString()
  @IsOptional()
  banStatus: 'all' | 'banned' | 'notBanned' = 'all';

  public createFilterName() {
    return {
      name: { $regex: this.searchNameTerm, $options: 'i' },
      isBanned: false,
    };
  }
  public SAcreateFilterName() {
    return { name: { $regex: this.searchNameTerm, $options: 'i' } };
  }

  public createBanStatus() {
    switch (this.banStatus) {
      case 'all':
        return [true, false];
      case 'banned':
        return [true];
      case 'notBanned':
        return [false];
    }
  }
  public createFilterNameAndUserId(userId: string) {
    return {
      $and: [
        { name: { $regex: '(?i)' + this.searchNameTerm + '(?-i)' } },
        { userId: userId },
      ],
    };
  }
}
