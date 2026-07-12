import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @ApiOperation({ summary: 'List all drivers, optional ?status= filter' })
  findAll(@Query() query: QueryDriverDto) {
    return this.driversService.findAll(query);
  }

  @Get('dispatch-pool')
  @ApiOperation({
    summary: 'Drivers eligible for trip assignment (Available + license valid)',
  })
  findDispatchPool() {
    return this.driversService.findDispatchEligible();
  }

  @Get('expiring-licenses')
  @ApiOperation({
    summary:
      'Drivers whose license expires within 7 days (bonus: reminder feed)',
  })
  expiringLicenses() {
    return this.driversService.findExpiringLicenses(7);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new driver' })
  create(@Body() dto: CreateDriverDto) {
    return this.driversService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver details or status (e.g. suspend)' })
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driversService.update(id, dto);
  }
}
