import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MSchema } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.entity';

export type PostDocument = HydratedDocument<Post> & Document;

const AttachmentSchema = new MSchema(
  {
    name: String,
    type: String,
    size: Number,
    url: String,
  },
  { _id: false },
);

type IAttachment = {
  name: string;
  type: string;
  size: number;
  url: string;
};

const LikeSchema = new MSchema(
  {
    user: String,
    emoji: String,
  },
  { _id: false },
);

type ILike = {
  user: string;
  emoji: string;
};

@Schema({
  timestamps: true,
})
export class Post extends Document {
  @Prop({ required: true, type: MSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: Boolean, default: false })
  resolved: boolean;

  @Prop({ required: true, type: [AttachmentSchema], default: [] })
  attachments: IAttachment[];

  @Prop({ required: true, type: [LikeSchema], default: [] })
  likes: ILike[];

  @Prop({ required: true, type: Number, default: 0 })
  likeCount: number;

  @Prop({ required: true, type: Number, default: 0 })
  commentCount: number;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

PostSchema.pre('find', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

PostSchema.pre('findOne', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

PostSchema.pre('findOneAndUpdate', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

PostSchema.pre('countDocuments', function () {
  this.where({ deletedAt: null, ...this.getQuery() });
});

export { PostSchema };
