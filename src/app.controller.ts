import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from './common/dto/api-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @ApiOperation({ summary: 'Healthcheck' })
  @ApiOkResponse({ type: ApiResponseDto })
  healthcheck(): string {
    return this.appService.getHealthcheck();
  }
}
