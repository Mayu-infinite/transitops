import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    example: 'Alex Johnson',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'DL0420241234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  licenseNumber: string;

  @ApiProperty({
    example: 'LMV',
    description: 'License category',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licenseCategory: string;

  @ApiProperty({
    example: '2029-05-30',
  })
  @IsDateString()
  licenseExpiry: Date;

  @ApiProperty({
    example: '+919876543210',
  })
  @IsPhoneNumber('IN')
  contactNumber: string;

  @ApiProperty({
    example: 92,
    minimum: 0,
    maximum: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  safetyScore: number;

  @ApiProperty({
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  @IsEnum(DriverStatus)
  status: DriverStatus;
}
