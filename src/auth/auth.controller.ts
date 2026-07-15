import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService, RegisteredOwnerResponse } from './auth.service';
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
}
