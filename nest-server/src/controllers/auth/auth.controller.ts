import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ExtractJwt } from 'passport-jwt';
import { Ip } from '@/shared/decorators/ip.decorator';
import { CurrentUser } from '@/shared/decorators/user.decorator';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { GetOperationId } from '@/shared/utils/get-operation-id';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { GrantType } from './dtos/grant-types.enum';
import { ResLoginDto } from './dtos/res-login.dto';
import { ReqLoginDto } from './dtos/req-login.dto';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: ResLoginDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation(GetOperationId('Users', 'Login'))
  async login(
    @Ip() userIp,
    @Body() credentials: ReqLoginDto,
  ): Promise<ResLoginDto> {
    const loginResults = await this.authService.login(credentials, userIp);

    if (!loginResults) {
      throw new UnauthorizedException(
        'This email, password combination was not found',
      );
    }

    return loginResults;
  }

  @Post('refreshtoken')
  async refreshToken(
    @Req() req,
    @Ip() userIp,
    @Body('refresh_token') refreshToken,
    @Query('client_id') clientId?: string,
  ) {
    let res: ResLoginDto;
    try {
      const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      this.logger.log(
        `[POST] refreshtoken ${refreshToken}, accessToken: ${oldAccessToken}`,
      );
      res = await this.tokenService.getAccessTokenFromRefreshToken(
        refreshToken,
        oldAccessToken,
        clientId,
        userIp,
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new BadRequestException('invalid_grant', error.message);
      }

      throw new InternalServerErrorException('invalid_grant');
    }
    return res;
  }

  @Get('access_token')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: ResLoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiQuery({ name: 'grant_type', enum: GrantType })
  @ApiQuery({ name: 'refresh_token', required: false })
  @ApiQuery({ name: 'client_id', required: false })
  @ApiOperation({ summary: 'AccessToken', description: 'Get a refresh token' })
  async token(
    @Req() req,
    @Ip() userIp,
    @Query('grant_type') grantType: GrantType,
    @Query('refresh_token') refreshToken?: string,
    @Query('client_id') clientId?: string,
  ): Promise<ResLoginDto> {
    let res: ResLoginDto;

    switch (grantType) {
      case GrantType.RefreshToken:
        try {
          // Get old access token
          const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          res = await this.tokenService.getAccessTokenFromRefreshToken(
            refreshToken,
            oldAccessToken,
            clientId,
            userIp,
          );
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw new BadRequestException('invalid_grant', error.message);
          }

          throw new InternalServerErrorException('invalid_grant');
        }

        return res;

      default:
        throw new BadRequestException('invalid_grant');
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiOperation(GetOperationId('Users', 'Logout'))
  async logout(
    @CurrentUser('id') userId,
    @Query('refresh_token') refreshToken?: string,
    @Query('from_all') fromAll: boolean = false,
  ): Promise<any> {
    if (fromAll) {
      await this.authService.logoutFromAll(userId);
    } else {
      if (!refreshToken) {
        throw new BadRequestException('No refresh token provided');
      }
      await this.authService.logout(refreshToken, userId);
    }
    return { message: 'ok' };
  }
}
