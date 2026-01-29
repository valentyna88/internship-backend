import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthcheckResponseDto } from './dto/healthcheck-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @ApiOkResponse({ type: HealthcheckResponseDto })
  healthcheck(): HealthcheckResponseDto {
    return this.appService.getHealthcheck();
  }
}
