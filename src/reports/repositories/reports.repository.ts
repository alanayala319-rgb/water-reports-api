import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

/**
 * Capa de acceso a datos para Report. Encapsula el Repository de
 * TypeORM de modo que el ReportsService nunca interactua
 * directamente con el ORM.
 */
@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
  ) {}

  create(dto: CreateReportDto): Report {
    return this.repository.create(dto);
  }

  async save(report: Report): Promise<Report> {
    return this.repository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Report | null> {
    return this.repository.findOne({ where: { id } });
  }
}
