import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

import { MaintenanceService } from './maintenance.service';

import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { QueryMaintenanceDto } from './dto/query-maintenance.dto';

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List maintenance records',
  })
  findAll(@Query() query: QueryMaintenanceDto) {
    return this.maintenanceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get maintenance record',
  })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({
    summary:
      'Open maintenance and automatically move vehicle to IN_SHOP',
  })
  create(
    @Body() dto: CreateMaintenanceDto,
  ) {
    return this.maintenanceService.openMaintenance(dto);
  }

  @Patch(':id')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({
    summary: 'Update maintenance record',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(id, dto);
  }

  @Patch(':id/close')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({
    summary:
      'Close maintenance and restore vehicle availability',
  })
  close(
    @Param('id') id: string,
  ) {
    return this.maintenanceService.closeMaintenance(id);
  }
}