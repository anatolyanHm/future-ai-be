import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import * as admin from 'firebase-admin';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UserController, UserFirebaseService } from './user';
import { ServiceAccount } from 'firebase-admin';
import { DealController } from 'deal/deal.controller';
import { DealService } from 'deal/deal.service';
import { EmailService } from 'mail/mail.service';
import { AccessStrategy } from 'lib/auth/stategy/access.stategy';
import { CustomAuthGuard } from 'lib/auth/guard/auth.guard';
import { RoleGuard } from 'lib/auth/guard/role.guard';
import { CombinedGuard } from 'lib/auth/guard/combined.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AuthController, UserController, DealController],
  providers: [
    UserFirebaseService,
    EmailService,
    DealService,
    AuthService,
    AccessStrategy,
    CustomAuthGuard,
    RoleGuard,
    {
      provide: APP_GUARD,
      useClass: CombinedGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: 'FIREBASE_APP',
      useFactory: (configService: ConfigService) => {
        const firebaseCredentials: ServiceAccount = {
          privateKey: configService
            .get<string>('PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get<string>('CLIENT_EMAIL'),
        };

        return admin.initializeApp({
          credential: admin.credential.cert(firebaseCredentials),
          databaseURL: `https://${firebaseCredentials.projectId}.firebaseio.com`,
          storageBucket: `${firebaseCredentials.projectId}.appspot.com`,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
