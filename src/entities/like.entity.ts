import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class like {
  @Prop() public addedAt: string;
  @Prop() public userId: string;
  @Prop() public login: string;
  @Prop() public status: 'Like' | 'Dislike';
  @Prop({ type: Boolean, default: false })
  public isBaned = false;
}
export const likeSchema = SchemaFactory.createForClass(like);
