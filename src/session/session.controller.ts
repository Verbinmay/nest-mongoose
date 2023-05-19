import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CurrentUserId } from '../decorator/currentUser.decorator';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { SessionService } from './session.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllSessionsCommand } from './application/use-cases/get-all-sessions-case';
import { makeAnswerInController } from '../helpers/errors';
import { DeleteAllSessionsWithoutCurrentCommand } from './application/use-cases/delete-all-session-without-current-case';
import { DeleteSessionByDeviceIdCommand } from './application/use-cases/delete-session-by-device-id-case';

@Controller('security')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getAll(@CurrentUserId() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetAllSessionsCommand(userId),
    );
    return makeAnswerInController(result);
  }
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete('devices')
  async deleteAllSessionsWithoutCurrent(@CurrentUserId() payload) {
    const result = await this.commandBus.execute(
      new DeleteAllSessionsWithoutCurrentCommand(payload.sub, payload.deviceId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete('devices/:deviceId')
  async deleteSessionByDeviceId(
    @Param('deviceId') deviceId: string,
    @CurrentUserId() user,
  ) {
    const userId = user ? user.sub : '';
    const result: boolean = await this.commandBus.execute(
      new DeleteSessionByDeviceIdCommand(userId, deviceId),
    );

    return makeAnswerInController(result);
  }
}
