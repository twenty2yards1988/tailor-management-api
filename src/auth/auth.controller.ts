import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AuthService,
  LoginResponse,
  RegisteredOwnerResponse,
} from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { UserRole } from '../users/enums/user-role.enum';

export interface CurrentUserResponse {
  message: string;
  user: AuthenticatedUser;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-owner')
  @ApiOperation({
    summary: 'Register an owner account for an existing shop',
  })
  @ApiBody({
    type: RegisterOwnerDto,
  })
  @ApiCreatedResponse({
    description: 'Owner registered successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data',
  })
  @ApiConflictResponse({
    description: 'Email already exists or shop already has an owner',
  })
  registerOwner(
    @Body() registerOwnerDto: RegisterOwnerDto,
  ): Promise<RegisteredOwnerResponse> {
    return this.authService.registerOwner(registerOwnerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login with owner account credentials',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'Login successful',
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or inactive account',
  })
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the authenticated JWT user payload',
  })
  @ApiOkResponse({
    description: 'Authenticated user fetched successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  getCurrentUser(@CurrentUser() user: AuthenticatedUser): CurrentUserResponse {
    return {
      message: 'Authenticated user fetched successfully',
      user,
    };
  }

  @Get('owner-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Confirm OWNER-only access',
  })
  @ApiOkResponse({
    description: 'Owner access confirmed',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  @ApiForbiddenResponse({
    description: 'Authenticated user does not have the required role',
  })
  getOwnerCheck(@CurrentUser() user: AuthenticatedUser): CurrentUserResponse {
    return {
      message: 'Owner access confirmed',
      user,
    };
  }
}
