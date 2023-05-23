import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../../db/user.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string) {
    /* на случай, если пользователь нажмет пробелы в перед или после логина */
    loginOrEmail = loginOrEmail.trim();

    const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user || user.banInfo.isBanned === true) return null;

    const match: boolean = await bcrypt.compare(password, user.hash);

    return match ? { sub: user._id.toString() } : null;
  }
}
