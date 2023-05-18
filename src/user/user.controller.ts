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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  createUser(@Body() inputModel: CreateUserDto) {
    return this.userService.createUser(inputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  findUsers(@Query() query: PaginationQuery) {
    return this.userService.getUsers(query);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
