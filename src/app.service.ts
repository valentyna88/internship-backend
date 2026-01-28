import { HttpStatus, Injectable } from '@nestjs/common';
import { HealthcheckResponseDto } from './dto/healthcheck-response.dto';

@Injectable()
export class AppService {
  getHealthcheck(): HealthcheckResponseDto {
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
