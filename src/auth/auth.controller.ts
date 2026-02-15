import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { RequestWithUser } from './interfaces/request-with-user.interface';
import { LoginResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { AllAuthGuard } from './guards/all-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current profile' })
  @ApiOkResponse({ type: User })
  getProfile(@Req() req: RequestWithUser): User {
    return req.user;
  }
}
