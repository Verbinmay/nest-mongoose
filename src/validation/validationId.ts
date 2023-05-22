import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { GetBlogByBlogIdCommand } from '../public/use-cases/blog/get-blog-by-blog-id-case';

@ValidatorConstraint({ name: 'ValidationBlogId', async: true })
@Injectable()
export class ValidationBlogId implements ValidatorConstraintInterface {
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(id: string, args: ValidationArguments) {
    try {
      await this.commandBus.execute(new GetBlogByBlogIdCommand(id));
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
