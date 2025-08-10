import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from '@/models/user.model';
import { CurrentUser } from '@/shared/decorators/user.decorator';
import { GetOperationId } from '@/shared/utils/get-operation-id';
import { MapperService } from '@/shared/mapper/mapper.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mapperService: MapperService,
  ) {
    this.mapperService.createMap(RegisterUserDto.name, User.name);
    this.mapperService
      .createMap(User.name, UserDto.name)
      .forSourceMember('_id', (opts) => opts.ignore())
      .forSourceMember('password', (opts) => opts.ignore())
      .forSourceMember('__v', (opts) => opts.ignore());
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.FOUND, type: UserDto })
  async getUserProfile(@CurrentUser('id') userId: string) {
    try {
      const userInfo = await this.userService.findById(userId);
      Logger.log('[GET] userProfile', userId, userInfo);
      return userInfo;
    } catch (error: any) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Error while get user by id: ' + userId,
      );
    }
  }

  @Post('/register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation(GetOperationId('User', 'Register'))
  async registerClient(@Body() data: RegisterUserDto): Promise<UserDto> {
    const { email } = data;

    let exist: User;
    try {
      exist = await this.userService.findOne({ email });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while creating user');
    }

    if (exist) {
      throw new BadRequestException(`${email} already exists`);
    }

    // const userModel = this.mapperService.map<User>(
    //   data,
    //   RegisterUserDto.name,
    //   User.name,
    // );
    const userModel = plainToInstance(User, data);
    const newUser = await this.userService.register(userModel);
    // return this.mapperService.map<UserDto>(newUser, User.name, UserDto.name);
    return plainToInstance(UserDto, newUser);
  }
}
