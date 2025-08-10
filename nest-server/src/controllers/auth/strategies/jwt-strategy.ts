import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '@/shared/configuration/configuration.service';
import { JwtPayload } from '../jwt-payload';
import { TokenService } from '../token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly tokenService: TokenService,
    configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      secretOrKey: configurationService.JWT.Key,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const result = await this.tokenService.validatePayload(payload);
    this.logger.log(
      `#### validate request token: ${JSON.stringify(payload)}, result: ${result}`,
    );
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
