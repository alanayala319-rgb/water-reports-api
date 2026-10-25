import { ReportSeverity } from '../enums/report-severity.enum';

/**
 * Datos minimos necesarios para armar la plantilla del correo de aviso.
 * Se acepta tanto un CreateReportDto "crudo" como una entidad Report ya
 * guardada (que ademas trae id y createdAt).
 */
export interface ReportTemplateData {
  id?: number;
  address: string;
  description: string;
  severity: ReportSeverity | string;
  reporterPhone: string;
  createdAt?: Date;
}

const SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: '#2e7d32',
  medium: '#ed6c02',
  high: '#c62828',
};

function escapeHtml(value: string): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDate(date?: Date): string {
  const value = date ?? new Date();
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(value);
}

/**
 * Genera el HTML del correo de aviso enviado a la cuadrilla de
 * mantenimiento cuando un ciudadano reporta una fuga de agua.
 * Usa tablas y estilos inline para maxima compatibilidad con
 * clientes de correo.
 */
export function generateReportTemplate(dto: ReportTemplateData, photoUrl: string): string {
  const severityKey = String(dto.severity).toLowerCase();
  const severityLabel = SEVERITY_LABELS[severityKey] ?? dto.severity;
  const severityColor = SEVERITY_COLORS[severityKey] ?? '#455a64';

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Nuevo reporte de fuga de agua</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f2f4f6; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6; padding: 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
            <tr>
              <td style="background-color:#0277bd; padding:20px 24px;">
                <h1 style="margin:0; color:#ffffff; font-size:20px;">Nuevo reporte de fuga de agua</h1>
                <p style="margin:4px 0 0; color:#e1f5fe; font-size:13px;">Sistema de reportes ciudadanos &mdash; Municipio</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px; color:#37474f; font-size:14px; line-height:1.5;">
                  Se ha registrado un nuevo reporte de fuga de agua en la via publica.
                  A continuacion los detalles para su atencion:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; color:#263238;">
                  ${dto.id !== undefined ? `
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold; width:160px;">Folio</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">#${dto.id}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold; width:160px;">Direccion / referencia</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">${escapeHtml(dto.address)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold;">Descripcion</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">${escapeHtml(dto.description)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold;">Severidad</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">
                      <span style="display:inline-block; padding:2px 10px; border-radius:12px; background-color:${severityColor}; color:#ffffff; font-size:12px; font-weight:bold;">
                        ${severityLabel}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold;">Telefono de contacto</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">${escapeHtml(dto.reporterPhone)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0; background-color:#fafafa; font-weight:bold;">Fecha del reporte</td>
                    <td style="padding:10px 12px; border:1px solid #e0e0e0;">${formatDate(dto.createdAt)}</td>
                  </tr>
                </table>
                <p style="margin:20px 0 8px;"><strong>Fotografia de la fuga:</strong></p>
                <img src="${escapeHtml(photoUrl)}" alt="Fotografia de la fuga" width="520" style="max-width:100%;height:auto;border-radius:8px;" />
                <p style="margin:20px 0 0; color:#607d8b; font-size:12px; line-height:1.5;">
                  Por favor coordinar la atencion de esta fuga con la brevedad posible segun su nivel de severidad.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px; background-color:#eceff1; text-align:center;">
                <p style="margin:0; color:#90a4ae; font-size:11px;">Este es un correo automatico generado por el Sistema de Reportes de Fugas de Agua.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}
