import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreateUserDto } from '../dto/create-user.dto';
import { ViewUserDto } from '../dto/view-user.dto';

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
  /* здесь нужно типизировать inputModel как  any, иначе не подтянется name в встроенном конструкторе и не InjectModel не сработает, придется вручную прописывать все имена строками */
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

  getViewModel(): ViewUserDto {
    const result = {
      id: this._id.toString(),
      login: this.login,
      email: this.email,
      createdAt: this.createdAt,
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
  getViewModel: User.prototype.getViewModel,
};

UserSchema.statics = {
  // createUser: User.createUser,
};

export type UsersDocument = HydratedDocument<User>;

export type UsersModelStaticType = {
  createUser: (inputModel: CreateUserDto) => UsersDocument;
};
export type UsersModelMethodsType = {
  getViewModel: (userId: string) => ViewUserDto;
};

export type UserModelType = Model<UsersDocument> &
  UsersModelStaticType &
  UsersModelMethodsType;
