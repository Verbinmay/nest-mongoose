import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PaginationQuery } from '../pagination/base-pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(LocalAuthGuard)
  @Post()
  createUser(@Body() inputModel: CreateUserDto) {
    return this.userService.createUser(inputModel);
  }

  @Get()
  findUsers(@Query() query: PaginationQuery) {
    return this.userService.getUsers(query);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
