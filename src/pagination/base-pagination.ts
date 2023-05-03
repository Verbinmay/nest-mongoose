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
  public createFilterName() {
    return { name: { $regex: '(?i)' + this.searchNameTerm + '(?-i)' } };
  }
}
