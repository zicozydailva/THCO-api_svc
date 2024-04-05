import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import {
  UserGender,
  UserLoginStrategy,
} from 'src/interfaces/strategy.interfaces';
import { IUser } from 'src/interfaces/user.interfaces';

@Schema()
export class UserDocument extends Document {
  @Prop({ index: true, type: String, required: true })
  firstName: string;

  @Prop({ index: true, type: String, required: true })
  lastName: string;

  @Prop({ required: false, type: String, default: null })
  phoneNumber: string;

  @Prop({ required: false, type: String, default: null })
  username: string;

  @Prop({
    unique: true,
    index: true,
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    required: false,
    type: String,
  })
  password: string;

  @Prop({
    default: null,
    type: String,
  })
  avatar: string;

  @Prop({
    default: null,
    type: String,
  })
  about: string;

  @Prop({
    default: null,
    type: Number,
  })
  age: number;

  @Prop({
    default: null,
    type: String,
  })
  gender: UserGender;

  @Prop({
    default: false,
    type: Boolean,
  })
  emailConfirm?: boolean;

  @Prop({
    type: String,
    default: UserLoginStrategy.LOCAL,
  })
  strategy: UserLoginStrategy;

  @Prop({
    type: [String],
    default: [],
  })
  myPasswords: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  hasChangedPassword: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  adminCreated: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;

  @Prop({
    type: Date,
    default: new Date(),
  })
  lastSeen?: Date;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'Business' })
  tenant: string;

  @Prop({
    type: [String],
    required: false,
  })
  subscriptionPlanId?: string[];

  @Prop({ type: [String], default: [] })
  programs: string[];

  createdAt?: Date;
  updatedAt?: Date;

  serialize(): IUser {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      username: this.username,
      avatar: this.avatar,
      about: this.about,
      age: this.age,
      emailConfirm: this.emailConfirm,
      hasChangedPassword: this.hasChangedPassword,
      createdAt: this.createdAt,
      lastSeen: this.lastSeen,
      tenant: this.tenant,
      subscriptionPlanId: this.subscriptionPlanId,
      programs: this.programs,
    };
  }
}

export const DroneSchema = SchemaFactory.createForClass(UserDocument);
