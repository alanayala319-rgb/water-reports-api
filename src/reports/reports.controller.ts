import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        return callback(new BadRequestException('Solo se aceptan imagenes JPEG, PNG o WebP'), false);
      }
      callback(null, true);
    },
  }))
  async create(@Body() dto: CreateReportDto, @UploadedFile() photo?: Express.Multer.File): Promise<Report> {
    if (!photo) throw new BadRequestException('La fotografia de la fuga es obligatoria (campo photo)');
    return this.reportsService.create(dto, photo);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }
}
