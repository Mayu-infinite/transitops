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
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto, CompleteTripDto } from './dto/update-trip.dto';
import { QueryTripDto } from './dto/query-trip.dto';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Create a new trip (DRAFT)' })
  create(@Body() dto: CreateTripDto) {
    return this.tripsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all trips with pagination and search' })
  findAll(@Query() query: QueryTripDto) {
    return this.tripsService.findAll(query);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Get dashboard counts for trips' })
  getCounts() {
    return this.tripsService.getCounts();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active (DISPATCHED) trips' })
  getActiveTrips() {
    return this.tripsService.getActiveTrips();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending (DRAFT) trips' })
  findPendingTrips() {
    return this.tripsService.findPendingTrips();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single trip by ID' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Update trip details' })
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.tripsService.update(id, dto);
  }

  @Post(':id/dispatch')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Dispatch a trip' })
  dispatch(@Param('id') id: string) {
    return this.tripsService.dispatch(id);
  }

  @Post(':id/complete')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Complete a trip' })
  complete(@Param('id') id: string, @Body() dto: CompleteTripDto) {
    return this.tripsService.complete(id, dto);
  }

  @Post(':id/cancel')
  @Roles(UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Cancel a trip' })
  cancel(@Param('id') id: string) {
    return this.tripsService.cancel(id);
  }
}
