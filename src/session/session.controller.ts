import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Controller('devices')
export class SessionsController {
  constructor(private readonly sessionsService: SessionService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUserId() userId) {
    console.log(userId);
    return this.sessionsService.findAll(userId.userId);
  }

  // @UseGuards(JwtRefreshStrategy)
  @HttpCode(204)
  @Delete()
  deleteAll(@CurrentUserId() userId) {
    return this.sessionsService.deleteAll({
      userId: userId.userId,
      deviceId: userId.deviceId,
    });
  }

  // @UseGuards(JwtRefreshStrategy)
  @HttpCode(204)
  @Delete(':deviceId')
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @CurrentUserId() userId,
  ) {
    const session: Session | null =
      await this.sessionsService.findSessionByDeviceId(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId !== userId.userId) {
      throw new ForbiddenException();
    }

    const sessionDelete: boolean =
      await this.sessionsService.deleteSessionsByDeviceId(deviceId);

    if (sessionDelete == false) {
      throw new NotFoundException();
    }
    return sessionDelete;
  }
}
