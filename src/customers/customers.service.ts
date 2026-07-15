import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, SortOrder, Types } from 'mongoose';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

type CustomerLeanDocument = Customer & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export interface PaginatedCustomersResult {
  data: CustomerLeanDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(
    shopId: string,
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    this.validateObjectId(shopId);

    try {
      const customer = new this.customerModel({
        ...createCustomerDto,
        shopId: new Types.ObjectId(shopId),
      });

      return await customer.save();
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'A customer with this phone number already exists in your shop.',
        );
      }

      throw error;
    }
  }

  async findAll(
    shopId: string,
    query: CustomerQueryDto,
  ): Promise<PaginatedCustomersResult> {
    this.validateObjectId(shopId);

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const sortDirection: SortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort = {
      [query.sortBy]: sortDirection,
    } satisfies Partial<Record<CustomerQueryDto['sortBy'], SortOrder>>;

    const filter: QueryFilter<CustomerDocument> = {
      shopId: new Types.ObjectId(shopId),
      isActive: true,
    };

    if (query.search) {
      const searchRegex = new RegExp(this.escapeRegex(query.search), 'i');

      filter.$or = [
        {
          fullName: searchRegex,
        },
        {
          phone: searchRegex,
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.customerModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<CustomerLeanDocument[]>()
        .exec(),
      this.customerModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(shopId: string, customerId: string): Promise<CustomerDocument> {
    this.validateObjectId(shopId);
    this.validateObjectId(customerId);

    const customer = await this.customerModel
      .findOne({
        _id: new Types.ObjectId(customerId),
        shopId: new Types.ObjectId(shopId),
        isActive: true,
      })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return customer;
  }

  async update(
    shopId: string,
    customerId: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    this.validateObjectId(shopId);
    this.validateObjectId(customerId);

    try {
      const customer = await this.customerModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(customerId),
            shopId: new Types.ObjectId(shopId),
            isActive: true,
          },
          updateCustomerDto,
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

      if (!customer) {
        throw new NotFoundException('Customer not found.');
      }

      return customer;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'A customer with this phone number already exists in your shop.',
        );
      }

      throw error;
    }
  }

  async deactivate(
    shopId: string,
    customerId: string,
  ): Promise<{ message: string }> {
    this.validateObjectId(shopId);
    this.validateObjectId(customerId);

    const customer = await this.customerModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(customerId),
          shopId: new Types.ObjectId(shopId),
          isActive: true,
        },
        {
          isActive: false,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return {
      message: 'Customer deactivated successfully.',
    };
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Customer not found.');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
