import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RequestCount {
  constructor(ip: string, route: string) {
    this.ip = ip;
    this.route = route;
  }

  @Prop({ default: new Types.ObjectId(), type: mongoose.Schema.Types.ObjectId })
  public _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  public ip: string;

  @Prop({ default: Date.now() })
  public data: number = Date.now();

  @Prop({ required: true })
  public route: string;
}

export const RequestCountSchema = SchemaFactory.createForClass(RequestCount);

export type RequestCountsDocument = HydratedDocument<RequestCount>;

export type RequestCountsModelType = Model<RequestCountsDocument>;
