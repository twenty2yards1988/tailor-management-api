import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ShopsService } from '../shops/shops.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';

export interface RegisteredOwnerResponse {
  message: string;
  user: UserDocument;
}

@Injectable()
export class AuthService {
  private readonly passwordSaltRounds = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly shopsService: ShopsService,
  ) {}

  async registerOwner(
    registerOwnerDto: RegisterOwnerDto,
  ): Promise<RegisteredOwnerResponse> {
    const normalizedEmail = registerOwnerDto.email.trim().toLowerCase();

    await this.shopsService.findById(registerOwnerDto.shopId);

    const ownerExists = await this.usersService.ownerExistsForShop(
      registerOwnerDto.shopId,
    );

    if (ownerExists) {
      throw new ConflictException('This shop already has an owner account.');
    }

    const existingUser = await this.usersService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(
      registerOwnerDto.password,
      this.passwordSaltRounds,
    );

    const user = await this.usersService.createOwner({
      name: registerOwnerDto.name,
      email: normalizedEmail,
      passwordHash,
      shopId: registerOwnerDto.shopId,
    });

    return {
      message: 'Owner registered successfully',
      user,
    };
  }
}
