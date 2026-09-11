import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReportSeverity } from '../enums/report-severity.enum';

@Entity('WATER_REPORT')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'address' })
  address: string;

  @Column({ type: 'varchar', name: 'description' })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportSeverity,
    name: 'severity',
  })
  severity: ReportSeverity;

  @Column({ type: 'varchar', name: 'reporter_phone' })
  reporterPhone: string;

  @Column({ type: 'boolean', name: 'is_resolved', default: false })
  isResolved: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
