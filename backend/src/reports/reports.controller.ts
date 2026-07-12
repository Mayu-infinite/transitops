import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { Role } from '@prisma/client';

import { ReportsService } from './reports.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get high-level dashboard metrics' })
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.reportsService.getDashboard(query);
  }

  @Get('analytics')
  @Roles(Role.FINANCIAL_ANALYST, Role.FLEET_MANAGER)
  @ApiOperation({ summary: 'Get detailed financial analytics' })
  getAnalytics() {
    return this.reportsService.getAnalytics();
  }

  @Get('export/csv')
  @Roles(Role.FINANCIAL_ANALYST, Role.FLEET_MANAGER)
  @ApiOperation({ summary: 'Export completed trips as CSV' })
  async exportCsv(@Res() res: Response) {
    const csvData = await this.reportsService.exportCompletedTrips();
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename=transitops-export.csv',
    );
    return res.send(csvData);
  }
}
