import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { JWTService } from '../Jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { SessionService } from '../session/session.service';
import { UserRepository } from '../user/user.repository';
import { NewPassword } from './dto/input-newpassword.dto';
import { Tokens } from './dto/tokens.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private jwtService: JWTService,
    private userRepository: UserRepository,
    private mailService: MailService,
    private authRepository: AuthRepository,
  ) {}

  // async validateUser(loginOrEmail: string, pass: string) {
  //   const user = await this.usersRepository.findUserByLoginOrEmail(
  //     loginOrEmail,
  //   );
  //   if (!user) return null;

  //   const match: boolean = await bcrypt.compare(pass, user.hash);

  //   return match ? user._id.toString() : null;
  // }

  async login(a: {
    userId: string;
    loginOrEmail: string;
    password: string;
    ip: string;
    title: string;
  }) {
    const deviceId: string = randomUUID();

    const tokens: Tokens = await this.jwtService.tokenCreator({
      sub: a.userId,
      deviceId: deviceId,
    });
    const decoder = await this.jwtService.decoderJWTs(tokens.refreshToken);

    if (typeof decoder == 'string') {
      return null;
    }
    const sessionCreate: boolean = await this.sessionService.createSession({
      iat: decoder.iat,
      expirationDate: decoder.exp,
      ip: a.ip,
      title: a.title,
      deviceId: deviceId,
      userId: a.userId,
    });

    return sessionCreate ? tokens : null;
  }

  async refreshTokens(payload) {
    const newTokens: Tokens = await this.jwtService.tokenCreator({
      sub: payload.sub,
      deviceId: payload.deviceId,
    });

    await this.sessionService.changeRefreshTokenInfo({
      newToken: newTokens.refreshToken,
      iatOldSession: payload.iat,
    });
    return newTokens;
  }

  async logout(payload) {
    const tokenRevoked = await this.sessionService.deleteSessionsByDeviceId(
      payload.deviceId,
    );

    return tokenRevoked ? true : false;
  }

  async authMe(userId) {
    const authGet: User | null = await this.userRepository.findUserById(userId);

    if (!authGet) {
      throw new UnauthorizedException();
    }

    return {
      email: authGet.email,
      login: authGet.login,
      userId: authGet._id.toString(),
    };
  }

  async registration(inputModel: CreateUserDto) {
    const hashBcrypt = await bcrypt.hash(inputModel.password, 10);

    const user: User = new User(inputModel, hashBcrypt);

    await this.userRepository.save(user);

    await this.mailService.sendUserConfirmation(
      inputModel.email,
      inputModel.login,
      user.emailConfirmation.confirmationCode,
    );

    return true;
  }

  async confirmEmail(code: string) {
    const userFind: User | null =
      await this.userRepository.findUserByConfirmationCode(code);
    if (!userFind) {
      return false;
    }
    if (userFind.emailConfirmation.isConfirmed) {
      return false;
    }
    if (userFind.emailConfirmation.confirmationCode !== code) {
      return false;
    }
    if (userFind.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    return await this.userRepository.updateConfirmation(
      userFind._id.toString(),
    );
  }

  async resendingEmail(email: string) {
    const userFind = await this.userRepository.findUserByEmail(email);

    if (!userFind) {
      return false;
    }
    if (userFind.emailConfirmation.isConfirmed) {
      return false;
    }
    const confirmationCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });
    const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      user: userFind,
    });
    if (!userUpdate) return false;

    await this.mailService.sendUserConfirmation(
      email,
      userFind.login,
      confirmationCode,
    );

    return true;
  }

  async resendingPassword(email: string) {
    const confirmationCode = randomUUID().toString();
    const userFind = await this.userRepository.findUserByEmail(email);
    if (!userFind) return false;

    await this.mailService.sendUserConfirmation(
      email,
      userFind.login,
      confirmationCode,
    );
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });
    const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      user: userFind,
    });
    return userUpdate;
  }

  // CONFIRM PASSWORD RECOVERY
  async confirmPassword(inputModel: NewPassword) {
    const userFind = await this.userRepository.findUserByConfirmationCode(
      inputModel.recoveryCode,
    );
    if (!userFind) {
      return false;
    }
    if (
      userFind.emailConfirmation.confirmationCode !== inputModel.recoveryCode
    ) {
      return false;
    }
    if (userFind.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    const hashBcrypt = await bcrypt.hash(inputModel.newPassword, 10);
    return await this.userRepository.updateConfirmationAndHash({
      id: userFind._id.toString(),
      hash: hashBcrypt,
    });
  }
}
