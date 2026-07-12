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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(RolesGuard) // JwtAuthGuard is applied globally in main.ts
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles with optional type/status/search filters' })
  findAll(@Query() query: QueryVehicleDto) {
    return this.vehiclesService.findAll(query);
  }

  @Get('dispatch-pool')
  @ApiOperation({ summary: 'Vehicles eligible for dispatch (excludes IN_SHOP / RETIRED)' })
  findDispatchPool() {
    return this.vehiclesService.findDispatchEligible();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single vehicle by id' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @Roles('FLEET_MANAGER')
  @ApiOperation({ summary: 'Register a new vehicle (regNo must be unique)' })
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Patch(':id')
  @Roles('FLEET_MANAGER')
  @ApiOperation({ summary: 'Update vehicle details or status' })
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('FLEET_MANAGER')
  @ApiOperation({ summary: 'Retire a vehicle (soft-delete: sets status = RETIRED)' })
  retire(@Param('id') id: string) {
    return this.vehiclesService.retire(id);
  }
}
