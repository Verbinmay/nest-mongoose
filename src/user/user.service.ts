import { Injectable } from '@nestjs/common';

import { UserRepository } from '../db/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const result = await this.userRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );

    return result ? true : false;
  }
}
