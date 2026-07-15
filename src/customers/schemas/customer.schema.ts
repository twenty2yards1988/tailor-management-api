import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Shop } from '../../shops/schemas/shop.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  timestamps: true,
})
export class Customer {
  @Prop({
    type: Types.ObjectId,
    ref: Shop.name,
    required: true,
  })
  shopId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  fullName!: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 20,
  })
  phone!: string;

  @Prop({
    trim: true,
    maxlength: 20,
  })
  alternatePhone?: string;

  @Prop({
    trim: true,
    maxlength: 300,
  })
  address?: string;

  @Prop({
    trim: true,
    maxlength: 1000,
  })
  notes?: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index(
  {
    shopId: 1,
    phone: 1,
  },
  {
    unique: true,
  },
);

CustomerSchema.index({
  shopId: 1,
  fullName: 1,
});

CustomerSchema.index({
  shopId: 1,
  createdAt: -1,
});
