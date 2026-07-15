import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserRole } from './enums/user-role.enum';
import { User, UserDocument } from './schemas/user.schema';

interface CreateOwnerInput {
  name: string;
  email: string;
  passwordHash: string;
  shopId: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: this.normalizeEmail(email),
      })
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: this.normalizeEmail(email),
      })
      .select('+passwordHash')
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    this.validateObjectId(id);

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async ownerExistsForShop(shopId: string): Promise<boolean> {
    this.validateObjectId(shopId);

    const ownerCount = await this.userModel
      .countDocuments({
        shopId,
        role: UserRole.OWNER,
      })
      .exec();

    return ownerCount > 0;
  }

  async createOwner(createOwnerInput: CreateOwnerInput): Promise<UserDocument> {
    this.validateObjectId(createOwnerInput.shopId);

    try {
      const user = new this.userModel({
        name: createOwnerInput.name.trim(),
        email: this.normalizeEmail(createOwnerInput.email),
        passwordHash: createOwnerInput.passwordHash,
        role: UserRole.OWNER,
        shopId: new Types.ObjectId(createOwnerInput.shopId),
        isActive: true,
      });

      const savedUser = await user.save();

      return this.findById(savedUser.id);
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'An account with this email already exists, or this shop already has an owner.',
        );
      }

      throw error;
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found');
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
