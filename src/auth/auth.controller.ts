import {
  Controller,
  Post,
  Body,
  Headers,
  Ip,
  UnauthorizedException,
  Res,
  UseGuards,
  HttpCode,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

import { Throttle } from '@nestjs/throttler';

import { JwtAuthGuard } from '../guard/auth-passport/guard-passport/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/auth-passport/guard-passport/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { errorMaker } from '../helpers/errors';
import { InputLogin } from './dto/input-login.dto';
import { NewPassword } from './dto/input-newpassword.dto';
import { RegistrationConfirmationCode } from './dto/input-registration-confirmation.dto';
import { ResendingConfirmation } from './dto/input-resending-confirmation.dto';
import { Tokens } from './dto/tokens.dto';
import { ViewMe } from './dto/view-me.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(5, 10)
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @CurrentUserId() currentUserId,
    @Body() inputModel: InputLogin,
    @Ip() ip: string,
    @Headers('user-agent') title: string | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginProcess: Tokens | null = await this.authService.login({
      userId: currentUserId,
      loginOrEmail: inputModel.loginOrEmail,
      password: inputModel.password,
      ip: ip,
      title: title ? title : 'default',
    });
    if (!loginProcess) {
      throw new UnauthorizedException();
    }

    res.cookie('refreshToken', loginProcess.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: loginProcess.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokens(
    @CurrentUserId() payload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newTokens = await this.authService.refreshTokens(payload);

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
    const result: boolean = await this.authService.logout(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async authMe(@CurrentUserId() payload) {
    const result: ViewMe = await this.authService.authMe(payload.sub);
    return result;
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputModel: CreateUserDto) {
    const registration: boolean = await this.authService.registration(
      inputModel,
    );
    return registration;
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(
    @Body() inputModel: RegistrationConfirmationCode,
  ) {
    const confirmPost: boolean = await this.authService.confirmEmail(
      inputModel.code,
    );
    if (confirmPost) {
      return true;
    } else {
      throw new BadRequestException(
        errorMaker(
          'If the confirmation code is incorrect, expired or already been applied',
          'code',
        ),
      );
    }
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration-email-resending')
  async emailResending(@Body() inputModel: ResendingConfirmation) {
    const emailResendingPost: boolean = await this.authService.resendingEmail(
      inputModel.email,
    );

    if (!emailResendingPost) {
      throw new BadRequestException(
        errorMaker(
          ' inputModel has incorrect values or if email is already confirmed',
          'email',
        ),
      );
    }
    return;
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() inputModel: ResendingConfirmation) {
    return await this.authService.resendingPassword(inputModel.email);
  }

  @Throttle(5, 10)
  @HttpCode(204)
  @Post('new-password')
  async create(@Body() inputModel: NewPassword) {
    const confirmPost: boolean = await this.authService.confirmPassword(
      inputModel,
    );

    if (confirmPost) {
      return true;
    } else {
      throw new BadRequestException(
        errorMaker(
          'If the confirmation code is incorrect, expired or already been applied',
          'recoveryCode',
        ),
      );
    }
  }
}
