import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../db/user.repository';

@ValidatorConstraint({ name: 'ValidationLoginEmail', async: true })
@Injectable()
export class ValidationLoginEmail implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string, args: ValidationArguments) {
    const userIsRegistered = await this.userRepository.findUserByLoginOrEmail(
      value,
    );
    if (userIsRegistered) return false;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Please change me';
  }
}
