import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SYSTEM_USER')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({
    type: 'boolean',
    name: 'is_notification_enabled',
    default: true,
  })
  isNotificationEnabled: boolean;
}
