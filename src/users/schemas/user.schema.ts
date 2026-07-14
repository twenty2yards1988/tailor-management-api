import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Shop } from '../../shops/schemas/shop.schema';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    enum: UserRole,
    required: true,
    default: UserRole.OWNER,
  })
  role!: UserRole;

  @Prop({
    type: Types.ObjectId,
    ref: Shop.name,
    required: true,
  })
  shopId!: Types.ObjectId;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
  },
);

UserSchema.index({
  shopId: 1,
});

UserSchema.index(
  {
    shopId: 1,
    role: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      role: UserRole.OWNER,
    },
  },
);

UserSchema.set('toJSON', {
  transform: (
    _document: UserDocument,
    returnedObject: { passwordHash?: string },
  ) => {
    delete returnedObject.passwordHash;
    return returnedObject;
  },
});
