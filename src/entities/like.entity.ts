import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class like {
  @Prop() addedAt: string;
  @Prop() userId: string;
  @Prop() login: string;
  @Prop() status: 'Like' | 'Dislike';
  @Prop({ type: Boolean, default: false })
  public isBaned = false;
}
export const likeSchema = SchemaFactory.createForClass(like);
