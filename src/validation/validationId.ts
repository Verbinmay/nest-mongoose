import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { BlogService } from '../blog/blog.service';

@ValidatorConstraint({ name: 'ValidationBlogId', async: true })
@Injectable()
export class ValidationBlogId implements ValidatorConstraintInterface {
  constructor(protected readonly blogService: BlogService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(text: string, args: ValidationArguments) {
    try {
      await this.blogService.getBlogById(text);
      return true;
    } catch (error) {
      return false;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'blogId not exist!';
  }
}
