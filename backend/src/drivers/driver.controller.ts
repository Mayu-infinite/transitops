import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UserRole } from '@prisma/client';
import { QueryDriverDto } from './dto/query-driver.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(RolesGuard)
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
  @Roles(UserRole.SAFETY_OFFICER, UserRole.FLEET_MANAGER)
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
  //   @Roles('FLEET_MANAGER', 'SAFETY_OFFICER')
  @Roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)
  @ApiOperation({ summary: 'Register a new driver' })
  create(@Body() dto: CreateDriverDto) {
    return this.driversService.create(dto);
  }

  @Patch(':id')
  //   @Roles('FLEET_MANAGER', 'SAFETY_OFFICER')
  @Roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)
  @ApiOperation({ summary: 'Update driver details or status (e.g. suspend)' })
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driversService.update(id, dto);
  }
}
