import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop, ShopDocument } from './schemas/shop.schema';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
  ) {}

  async create(createShopDto: CreateShopDto): Promise<ShopDocument> {
    try {
      const shop = new this.shopModel(createShopDto);
      return await shop.save();
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'A shop with this phone number or email already exists',
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<ShopDocument[]> {
    return this.shopModel
      .find({
        isActive: true,
      })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findById(id: string): Promise<ShopDocument> {
    this.validateObjectId(id);

    const shop = await this.shopModel.findById(id).exec();

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async update(
    id: string,
    updateShopDto: UpdateShopDto,
  ): Promise<ShopDocument> {
    this.validateObjectId(id);

    try {
      const shop = await this.shopModel
        .findByIdAndUpdate(id, updateShopDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }

      return shop;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'A shop with this phone number or email already exists',
        );
      }

      throw error;
    }
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const shop = await this.findById(id);

    shop.isActive = false;
    await shop.save();

    return {
      message: 'Shop deactivated successfully',
    };
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Shop not found');
    }
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
