import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
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
}
