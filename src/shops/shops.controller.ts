import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new tailoring shop',
  })
  @ApiCreatedResponse({
    description: 'Shop created successfully',
  })
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active shops',
  })
  @ApiOkResponse({
    description: 'Active shops fetched successfully',
  })
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one shop by ID',
  })
  findById(@Param('id') id: string) {
    return this.shopsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a shop',
  })
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate a shop',
  })
  deactivate(@Param('id') id: string) {
    return this.shopsService.deactivate(id);
  }
}
