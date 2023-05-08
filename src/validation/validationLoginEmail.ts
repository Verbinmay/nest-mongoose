import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';

@ValidatorConstraint({ name: 'ValidationBlogId', async: true })
@Injectable()
export class ValidationLoginEmail implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: any, args: ValidationArguments) {
    const userIsRegistered: boolean =
      await this.userService.findUserByLoginOrEmail(value);

    return !userIsRegistered;
  }
}
