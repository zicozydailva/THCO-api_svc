import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MSchema } from 'mongoose';

import { Post } from './post.schema';
import { User } from 'src/modules/user/schemas/user.entity';

export type CommentDocument = HydratedDocument<Comment> & Document;

const ReplySchema = new MSchema(
  {
    user: { required: true, type: MSchema.Types.ObjectId, ref: User.name },
    content: String,
  },
  { timestamps: true },
);

type IReply = {
  _id: string;
  user: User;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
})
export class Comment extends Document {
  @Prop({ required: true, type: MSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true, type: MSchema.Types.ObjectId, ref: Post.name })
  post: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, required: true, default: 0 })
  replyCount: number;

  @Prop({ required: true, type: [ReplySchema], default: [] })
  replies: IReply[];

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

CommentSchema.pre('find', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

CommentSchema.pre('findOne', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

CommentSchema.pre('findOneAndUpdate', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

CommentSchema.pre('countDocuments', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

export { CommentSchema };
