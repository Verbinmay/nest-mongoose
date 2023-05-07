import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UsersModelType as UserModelType } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async save(user: User) {
    const userModel = new this.UserModel(user);
    return userModel.save();
  }

  async findCountUsers(filter: object) {
    return await this.UserModel.countDocuments(filter);
  }

  async findUsers(a: { find: object; sort: any; skip: number; limit: number }) {
    const result: Array<User> = await this.UserModel.find(a.find)
      .sort(a.sort)
      .skip(a.skip)
      .limit(a.limit);

    return result;
  }

  async findUserById(id: string): Promise<User> {
    try {
      return await this.UserModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.UserModel.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const result = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean();
    return result;
  }
}
