import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthcheck() {
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
