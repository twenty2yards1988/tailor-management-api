import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const toNumber = ({ value }: { value: unknown }) =>
  value === undefined || value === null || value === ''
    ? undefined
    : Number(value);

export class CustomerQueryDto {
  @ApiPropertyOptional({
    example: 'radhika',
    description: 'Searches customer name and phone number',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Transform(toNumber)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Transform(toNumber)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: ['fullName', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsIn(['fullName', 'createdAt', 'updatedAt'])
  sortBy: 'fullName' | 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}
