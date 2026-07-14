import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({
  timestamps: true,
})
export class Shop {
  @Prop({
    required: true,
    trim: true,
  })
  shopName!: string;

  @Prop({
    required: true,
    trim: true,
  })
  ownerName!: string;

  @Prop({
    required: true,
    trim: true,
  })
  phone!: string;

  @Prop({
    trim: true,
    lowercase: true,
  })
  email?: string;

  @Prop({
    trim: true,
  })
  address?: string;

  @Prop()
  logoUrl?: string;

  @Prop({
    default: 'INR',
  })
  currency!: string;

  @Prop({
    default: 'Asia/Kolkata',
  })
  timezone!: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

ShopSchema.index(
  {
    phone: 1,
  },
  {
    unique: true,
  },
);

ShopSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);
