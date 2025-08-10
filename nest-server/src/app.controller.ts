import { Get, Controller, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './controllers/auth/strategies/jwt-auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async root(): Promise<any> {
    return [{ value: 1, message: 'Hello World!' }];
  }
}
