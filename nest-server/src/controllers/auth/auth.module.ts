import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { TokenService } from './token/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { RefreshToken } from '@/models/refresh-token.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationService } from '@/shared/configuration/configuration.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: async (configService: ConfigurationService) => ({
        secret: configService.JWT.Key,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
    MongooseModule.forFeature([
      { name: RefreshToken.modelName, schema: RefreshToken.model.schema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, TokenService],
  exports: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
