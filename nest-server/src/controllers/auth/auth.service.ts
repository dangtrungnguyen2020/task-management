import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from './jwt-payload';
import { TokenService } from './token/token.service';
import { ResLoginDto } from './dtos/res-login.dto';
import { ReqLoginDto } from './dtos/req-login.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async login(
    credentials: ReqLoginDto,
    ipAddress: string,
  ): Promise<ResLoginDto> {
    const loginResults = await this.userService.login(credentials);

    if (!loginResults) {
      return null;
    }

    const payload: JwtPayload = {
      sub: loginResults.id,
    };

    const loginResponse: ResLoginDto =
      await this.tokenService.createAccessToken(payload);

    // We save the user's refresh token
    const tokenContent = {
      userId: loginResults.id,
      clientId: credentials.clientId,
      ipAddress,
    };
    const refresh = await this.tokenService.createRefreshToken(tokenContent);

    loginResponse.refreshToken = refresh;

    return loginResponse;
  }

  async logout(userId: string, refreshToken: string): Promise<any> {
    await this.tokenService.deleteRefreshToken(userId, refreshToken);
  }

  /**
   * Logout the user from all the devices by invalidating all his refresh tokens
   * @param userId The user id to logout
   */
  async logoutFromAll(userId: string): Promise<any> {
    await this.tokenService.deleteRefreshTokenForUser(userId);
  }
}
