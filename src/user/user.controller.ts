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
import { BasicAuthGuard } from '../guard/auth-passport/guard-passport/basic-auth.guard';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CommandBus } from '@nestjs/cqrs';
import { makeAnswerInController } from '../helpers/errors';
import { CreateUserCommand } from './application/use-cases/create-user-case';
import { GetAllUsersCommand } from './application/use-cases/get-all-users-case';
import { DeleteUserCommand } from './application/use-cases/delete-user-case';

@Controller('users')
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
}
