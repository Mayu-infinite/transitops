import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles' })
  findAll(@Query('search') search?: string) {
    return search
      ? this.vehiclesService.search(search)
      : this.vehiclesService.findAll();
  }

  @Get('dispatch-pool')
  @ApiOperation({ summary: 'Vehicles eligible for dispatch' })
  findDispatchPool() {
    return this.vehiclesService.findDispatchEligible();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single vehicle by id' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Register a new vehicle' })
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Update vehicle details' })
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Retire a vehicle' })
  retire(@Param('id') id: string) {
    return this.vehiclesService.retire(id);
  }
}
