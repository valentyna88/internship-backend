import {
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { AllAuthGuard } from './guards/all-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../user/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

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
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current profile' })
  @ApiOkResponse({ type: User })
  getProfile(@CurrentUser() user: User): User {
    return user;
  }
}
