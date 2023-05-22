import {
  Controller,
  Post,
  Body,
  Headers,
  Ip,
  Res,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { Response } from 'express';

import { Throttle } from '@nestjs/throttler';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { LocalAuthGuard } from '../../guard/auth-passport/guard-passport/local-auth.guard';
import { CreateUserDto } from '../../sa/dto/create-user.dto';
import { CurrentUserId } from '../../decorator/currentUser.decorator';
import { RefreshTokenGuard } from '../../guard/refresh-token.guard';
import { makeAnswerInController } from '../../helpers/errors';
import { InputLogin } from '../../auth/dto/input-login.dto';
import { NewPassword } from '../../auth/dto/input-newpassword.dto';
import { RegistrationConfirmationCode } from '../../auth/dto/input-registration-confirmation.dto';
import { ResendingConfirmation } from '../../auth/dto/input-resending-confirmation.dto';
import { Tokens } from '../../auth/dto/tokens.dto';
import { ViewMe } from '../../auth/dto/view-me.dto';

import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../../auth/application/use-cases/login-case';
import { GetNewTokensCommand } from '../../auth/application/use-cases/get-new-refresh-token-case';
import { LogoutCommand } from '../../auth/application/use-cases/logout-case';
import { GetMeCommand } from '../../auth/application/use-cases/get-me-case';
import { RegistrationCommand } from '../../auth/application/use-cases/registration-case';
import { RegistrationConfirmationCommand } from '../../auth/application/use-cases/registration-confirmation-case';
import { ResendingEmailCommand } from '../../auth/application/use-cases/resending-email-case';
import { PasswordRecoveryCommand } from '../../auth/application/use-cases/password-recovery-case';
import { ConfirmPasswordRecoveryCommand } from '../../auth/application/use-cases/confirm-password-recovery-case';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Throttle(5, 10)
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @CurrentUserId() user,
    @Body() inputModel: InputLogin,
    @Ip() ip: string,
    @Headers('user-agent') title: string | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = user ? user.sub : '';
    const loginProcess: Tokens | string = await this.commandBus.execute(
      new LoginCommand(
        userId,
        inputModel.loginOrEmail,
        inputModel.password,
        ip,
        title ? title : 'default',
      ),
    );
    const result = makeAnswerInController(loginProcess);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: result.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async getNewTokens(
    @CurrentUserId() payload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newTokens = await this.commandBus.execute(
      new GetNewTokensCommand(payload),
    );

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: newTokens.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@CurrentUserId() payload) {
    const result: boolean | string = await this.commandBus.execute(
      new LogoutCommand(payload),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async authMe(@CurrentUserId() user) {
    const userId = user ? user.sub : '';
    const result: ViewMe = await this.commandBus.execute(
      new GetMeCommand(userId),
    );
    return makeAnswerInController(result);
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputModel: CreateUserDto) {
    const registration: boolean = await this.commandBus.execute(
      new RegistrationCommand(inputModel),
    );
    return registration;
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(
    @Body() inputModel: RegistrationConfirmationCode,
  ) {
    const result: boolean = await this.commandBus.execute(
      new RegistrationConfirmationCommand(inputModel.code),
    );
    return makeAnswerInController(result);
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration-email-resending')
  async emailResending(@Body() inputModel: ResendingConfirmation) {
    const result: boolean = await this.commandBus.execute(
      new ResendingEmailCommand(inputModel.email),
    );
    return makeAnswerInController(result);
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() inputModel: ResendingConfirmation) {
    return await this.commandBus.execute(
      new PasswordRecoveryCommand(inputModel.email),
    );
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('new-password')
  async create(@Body() inputModel: NewPassword) {
    const result: boolean = await this.commandBus.execute(
      new ConfirmPasswordRecoveryCommand(inputModel),
    );
    return makeAnswerInController(result);
  }
}
