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
} from '@nestjs/common';
import { Response } from 'express';

import { LocalAuthGuard } from '../auth-pasport/guard/local-auth.guard';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { InputLogin } from './dto/input-login.dto';
import { Tokens } from './dto/token.dto';
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

  // @Post('refresh-token')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('logout')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('registration')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('registration-confirmation')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('registration-email-resending')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('password-recovery')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  // @Post('new-password')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
}
