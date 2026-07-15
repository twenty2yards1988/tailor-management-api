import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ShopsService } from '../shops/shops.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface RegisteredOwnerResponse {
  message: string;
  user: UserDocument;
}

interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  shopId: string;
  role: UserDocument['role'];
  isActive: boolean;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUserResponse;
}

@Injectable()
export class AuthService {
  private readonly passwordSaltRounds = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly shopsService: ShopsService,
    private readonly jwtService: JwtService,
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

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account is inactive.');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      shopId: user.shopId.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: this.toAuthUserResponse(user),
    };
  }

  private toAuthUserResponse(user: UserDocument): AuthUserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      shopId: user.shopId.toString(),
      role: user.role,
      isActive: user.isActive,
    };
  }
}
