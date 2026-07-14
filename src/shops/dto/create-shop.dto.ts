import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateShopDto {
  @ApiProperty({
    example: 'Perfect Fit Tailors',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shopName!: string;

  @ApiProperty({
    example: 'Radhika Sharma',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ownerName!: string;

  @ApiProperty({
    example: '+919876543210',
  })
  @IsPhoneNumber()
  phone!: string;

  @ApiPropertyOptional({
    example: 'radhika@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Pune, Maharashtra',
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
