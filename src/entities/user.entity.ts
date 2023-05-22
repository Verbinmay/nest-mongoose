import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreateUserDto } from '../sa/dto/create-user.dto';
import { SAViewUserDto } from '../sa/dto/sa-view-user.dto';

@Schema()
export class banInfo {
  @Prop({ type: Boolean, default: false })
  isBanned = false;
  @Prop({ type: String })
  banDate = '';
  @Prop({ type: String })
  banReason = '';
}

export const banInfoSchema = SchemaFactory.createForClass(banInfo);

@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string = randomUUID();
  @Prop()
  expirationDate: Date = add(new Date(), {
    hours: 1,
    minutes: 3,
  });
  @Prop({ type: Boolean, default: false })
  isConfirmed = false;
}

export const emailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  /* здесь нужно типизировать inputModel как  any, иначе не подтянется name в встроенном конструкторе и InjectModel не сработает, придется вручную прописывать все имена строками */
  constructor(inputModel: any, hash: string) {
    this.login = inputModel.login;
    this.email = inputModel.email;
    this.hash = hash;
  }
  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  public login: string;

  @Prop({ required: true })
  public email: string;

  @Prop({ required: true })
  public hash: string;

  @Prop({ default: new Date().toISOString() })
  public createdAt: string = new Date().toISOString();

  @Prop({ default: new Date().toISOString() })
  public updatedAt: string = new Date().toISOString();

  @Prop({ type: emailConfirmationSchema, required: true })
  public emailConfirmation: EmailConfirmation = new EmailConfirmation();

  @Prop({ type: banInfoSchema, required: true })
  public banInfo: banInfo = new banInfo();

  SAGetViewModel(): SAViewUserDto {
    const result = {
      id: this._id.toString(),
      login: this.login,
      email: this.email,
      createdAt: this.createdAt,
      banInfo: {
        isBanned: this.banInfo.isBanned,
        banDate: this.banInfo.banDate,
        banReason: this.banInfo.banReason,
      },
    };

    return result;
  }

  // static createUser(inputModel: CreateUserDto, hash: string): User {
  //   const user = new User();
  //   user.login = inputModel.login;
  //   user.email = inputModel.email;
  //   user.hash = hash;

  //   const emailConfirmation = new EmailConfirmation();

  //   user.emailConfirmation = emailConfirmation;
  //   return user;
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  SAGetViewModel: User.prototype.SAGetViewModel,
};

UserSchema.statics = {
  // createUser: User.createUser,
};

export type UsersDocument = HydratedDocument<User>;

export type UsersModelStaticType = {
  createUser: (inputModel: CreateUserDto) => UsersDocument;
};
export type UsersModelMethodsType = {
  SAGetViewModel: (userId: string) => SAViewUserDto;
};

export type UserModelType = Model<UsersDocument> &
  UsersModelStaticType &
  UsersModelMethodsType;
