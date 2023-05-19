import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserModelType } from './entities/user.entity';

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
      await this.UserModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
  /*Нам не подходит функция ниже, ибо нужно знать, где именно происходит совпадение(поле ошибки) */
  async findUserByLoginOrEmail(loginOrEmail: string) {
    const result = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean();
    return result;
  }

  async findUserByConfirmationCode(code: string) {
    const result: User | null = await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    }).lean();
    return result;
  }

  async updateConfirmation(id: string) {
    try {
      const result = await this.UserModel.findById(id);

      if (!result) return false;

      result.emailConfirmation.isConfirmed = true;

      result.save();

      return true;
    } catch (e) {
      return false;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return this.UserModel.findOne({
        email: email,
      });
    } catch (e) {
      return null;
    }
  }

  async updateConfirmationAndHash(a: { id: string; hash: string }) {
    try {
      const result = await this.UserModel.findById(a.id);

      if (!result) return false;

      result.emailConfirmation.isConfirmed = true;
      result.hash = a.hash;
      result.save();

      return true;
    } catch (e) {
      return false;
    }
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
