import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Register a new vehicle' })
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Retire a vehicle' })
  retire(@Param('id') id: string) {
    return this.vehiclesService.retire(id);
  }
}
