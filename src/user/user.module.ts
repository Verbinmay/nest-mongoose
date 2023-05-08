import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ValidationLoginEmail } from '../validation/validationLoginEmail';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ValidationLoginEmail],
})
export class UserModule {}
