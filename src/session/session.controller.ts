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
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Controller('devices')
export class SessionsController {
  constructor(private readonly sessionsService: SessionService) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  findAll(@CurrentUserId() payload) {
    return this.sessionsService.findAll(payload.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete()
  deleteAll(@CurrentUserId() payload) {
    return this.sessionsService.deleteAll({
      userId: payload.sub,
      deviceId: payload.deviceId,
    });
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete(':deviceId')
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @CurrentUserId() payload,
  ) {
    const session: Session | null =
      await this.sessionsService.findSessionByDeviceId(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId !== payload.sub) {
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
