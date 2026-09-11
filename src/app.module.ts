import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule, ReportsModule, UsersModule, AuthModule],
})
export class AppModule {}
