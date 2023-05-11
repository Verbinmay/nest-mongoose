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

import { JwtAuthGuard } from '../guard/auth-pasport/guard-pasport/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/auth-pasport/guard-pasport/local-auth.guard';
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

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @CurrentUserId() currentUserId,
    @Body() inputModel: InputLogin,
    @Ip() ip: string,
    @Headers('user-agent') title: string | null,
    @Res() res: Response,
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

    return res.json({ accessToken: loginProcess.accessToken });
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

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputModel: CreateUserDto) {
    const registration: boolean = await this.authService.registration(
      inputModel,
    );

    return registration;
  }

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

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() inputModel: ResendingConfirmation) {
    return await this.authService.resendingPassword(inputModel.email);
  }

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
