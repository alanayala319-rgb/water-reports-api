import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.mailHost,
      port: envs.mailPort,
      secure: envs.mailSecure,
      auth: {
        user: envs.mailUser,
        pass: envs.mailPassword,
      },
    });
  }

  /**
   * Envia un correo HTML.
   * @param to destinatario(s), separados por coma si son varios
   * @param subject asunto del correo
   * @param template contenido HTML ya generado (ej. generateReportTemplate)
   */
  async sendEmail(to: string, subject: string, template: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: envs.mailFrom,
        to,
        subject,
        html: template,
      });
      this.logger.log(`Correo enviado a ${to} - asunto: "${subject}"`);
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${to}: ${(error as Error).message}`);
      throw error;
    }
  }
}
