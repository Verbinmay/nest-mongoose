import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class like {
  @Prop() addedAt: string;
  @Prop() userId: string;
  @Prop() login: string;
  @Prop() status: 'Like' | 'Dislike';
}
export const likeSchema = SchemaFactory.createForClass(like);
