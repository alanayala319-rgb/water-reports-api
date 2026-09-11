import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ReportSeverity } from '../enums/report-severity.enum';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsEnum(ReportSeverity, {
    message: 'severity debe ser uno de los siguientes valores: low, medium, high',
  })
  severity: ReportSeverity;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber(undefined, {
    message: 'reporterPhone debe ser un numero telefonico valido',
  })
  reporterPhone: string;
}
