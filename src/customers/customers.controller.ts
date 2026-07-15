import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a customer for the authenticated shop',
  })
  @ApiCreatedResponse({
    description: 'Customer created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid customer data',
  })
  @ApiConflictResponse({
    description: 'Customer phone already exists in this shop',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  create(
    @CurrentUser('shopId') shopId: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(shopId, createCustomerDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get searchable and paginated customers for the authenticated shop',
  })
  @ApiOkResponse({
    description: 'Customers fetched successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  findAll(
    @CurrentUser('shopId') shopId: string,
    @Query() query: CustomerQueryDto,
  ) {
    return this.customersService.findAll(shopId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one customer from the authenticated shop',
  })
  @ApiOkResponse({
    description: 'Customer fetched successfully',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  findOne(@CurrentUser('shopId') shopId: string, @Param('id') id: string) {
    return this.customersService.findOne(shopId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a customer from the authenticated shop',
  })
  @ApiOkResponse({
    description: 'Customer updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid customer data',
  })
  @ApiConflictResponse({
    description: 'Customer phone already exists in this shop',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  update(
    @CurrentUser('shopId') shopId: string,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(shopId, id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate a customer from the authenticated shop',
  })
  @ApiOkResponse({
    description: 'Customer deactivated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  deactivate(@CurrentUser('shopId') shopId: string, @Param('id') id: string) {
    return this.customersService.deactivate(shopId, id);
  }
}
