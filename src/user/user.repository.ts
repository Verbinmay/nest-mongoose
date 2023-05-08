import { User, UsersModelType as UserModelType } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

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
  /*Нам не подходит функция ниже, ибо нужно знать, где именно происходит совпадение(поле ошибки) */
  async findUserByLoginOrEmail(loginOrEmail: string) {
    const result: User | null = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean();
    return result;
  }

  // async findUserByLoginOrEmail(login: string, email: string) {
  //   const result: Array<User> | [] = await this.UserModel.find({
  //     $or: [
  //       { login: { $in: [login, email] } },
  //       { email: { $in: [login, email] } },
  //     ],
  //   }).lean();
  //   return result;
  // }
}
