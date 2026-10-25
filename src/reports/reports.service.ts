import { Injectable, Logger } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { EmailService } from '../email/email.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { generateReportTemplate } from './templates/report.template';
import { StorageService } from '../storage/storage.service';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Crea el reporte de fuga, lo persiste en WATER_REPORT y notifica
   * por correo a la cuadrilla de mantenimiento con los datos de la fuga.
   * El fallo en el envio de correo no revierte el reporte ya guardado,
   * pero se registra para su seguimiento.
   */
  async create(dto: CreateReportDto, photo: Express.Multer.File): Promise<Report> {
    const photoUrl = await this.storageService.uploadFile(photo, 'reports');
    const report = this.reportsRepository.create({ ...dto, photoUrl });
    const savedReport = await this.reportsRepository.save(report);

    const html = generateReportTemplate(savedReport, photoUrl);

    try {
      await this.emailService.sendEmail(
        envs.maintenanceCrewEmail,
        `Nuevo reporte de fuga de agua #${savedReport.id} - ${savedReport.address}`,
        html,
      );
    } catch (error) {
      this.logger.error(
        `El reporte #${savedReport.id} se guardo pero fallo el envio del correo de aviso: ${
          (error as Error).message
        }`,
      );
    }

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.findAll();
  }
}
