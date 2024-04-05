import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Token {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;

  @Prop({ required: false, type: Date })
  expirationTime: Date;
}

export type TokenDocument = Token & Document;

export const TokenSchema = SchemaFactory.createForClass(Token);
