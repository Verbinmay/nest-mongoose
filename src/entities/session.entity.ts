import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreateSessionDto } from '../public/dto/session/create-session.dto';
import { ViewSessionDto } from '../public/dto/session/view-session.dto';

@Schema()
export class Session {
  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  public ip: string;

  @Prop({ required: true })
  public title: string;

  @Prop({ required: true })
  public lastActiveDate: string;

  @Prop({ required: true })
  public expirationDate: string;

  @Prop({ required: true })
  public deviceId: string;

  @Prop({ required: true })
  public userId: string;

  updateInfo(inputModel: any) {
    this.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
    this.expirationDate = new Date(inputModel.exp * 1000).toISOString();
    return this;
  }

  getViewModel(): ViewSessionDto {
    const result = {
      ip: this.ip,
      title: this.title,
      lastActiveDate: this.lastActiveDate,
      deviceId: this.deviceId,
    };
    return result;
  }

  static createSession(inputModel: CreateSessionDto): Session {
    const session = new Session();
    session.ip = inputModel.ip;
    session.title = inputModel.title;
    session.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
    session.expirationDate = new Date(inputModel.iat * 1000).toISOString();
    session.deviceId = inputModel.deviceId;
    session.userId = inputModel.userId;

    return session;
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.methods = {
  updateInfo: Session.prototype.updateInfo,
  getViewModel: Session.prototype.getViewModel,
};

SessionSchema.statics = {
  createSession: Session.createSession,
};

export type SessionDocument = HydratedDocument<Session>;

export type SessionModelStaticType = {
  createSession: (inputModel: CreateSessionDto) => SessionDocument;
};
export type SessionModelMethodsType = {
  updateInfo: (inputModel: any) => Session;
  getViewModel: () => ViewSessionDto;
};

export type SessionModelType = Model<SessionDocument> &
  SessionModelStaticType &
  SessionModelMethodsType;
