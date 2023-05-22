import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../guard/auth-passport/guard-passport/basic-auth.guard';
import { PaginationQuery } from '../../pagination/base-pagination';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../../user/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { makeAnswerInController } from '../../helpers/errors';
import { CreateUserCommand } from '../use-cases/users/create-user-case';
import { GetAllUsersCommand } from '../use-cases/users/get-all-users-case';
import { DeleteUserCommand } from '../use-cases/users/delete-user-case';
import { BanUserDto } from '../dto/ban-user.dto copy';
import { BunUserCommand } from '../use-cases/users/bun-user-case';

@Controller('sa/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private commandBus: CommandBus,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() inputModel: CreateUserDto) {
    const result = await this.commandBus.execute(
      new CreateUserCommand(inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUsers(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(new GetAllUsersCommand(query));
    console.log(result);
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result: boolean | string = await this.commandBus.execute(
      new DeleteUserCommand(id),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id/ban')
  @HttpCode(204)
  async banUser(@Param('id') userId: string, @Body() inputModel: BanUserDto) {
    const result: boolean | string = await this.commandBus.execute(
      new BunUserCommand(userId, inputModel),
    );
    return makeAnswerInController(result);
  }
}
