import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    // El service guarda el reporte en WATER_REPORT y envia el correo
    // de aviso a la cuadrilla de mantenimiento con la plantilla HTML.
    return this.reportsService.create(createReportDto);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }
}
