import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const phonePattern = /^\+?(?=.*\d)[0-9\s-]+$/;

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Radhika Sharma',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;

  @ApiProperty({
    example: '+919876543210',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Matches(phonePattern, {
    message:
      'phone must contain only digits, spaces, hyphens, and an optional leading plus',
  })
  phone!: string;

  @ApiPropertyOptional({
    example: '9876543210',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Matches(phonePattern, {
    message:
      'alternatePhone must contain only digits, spaces, hyphens, and an optional leading plus',
  })
  alternatePhone?: string;

  @ApiPropertyOptional({
    example: 'Pune, Maharashtra',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({
    example: 'Prefers evening appointments.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
