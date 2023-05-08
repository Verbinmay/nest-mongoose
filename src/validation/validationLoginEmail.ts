import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';

@ValidatorConstraint({ name: 'ValidationLoginEmail', async: true })
@Injectable()
export class ValidationLoginEmail implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string, args: ValidationArguments) {
    const userIsRegistered = await this.userService.findUserByLoginOrEmail(
      value,
    );

    return !userIsRegistered;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Please change me';
  }
}
