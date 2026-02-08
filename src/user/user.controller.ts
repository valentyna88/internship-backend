import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { UserPaginationDetailDto } from './dto/user-pagination.dto';
import { UserSingleDetailDto } from './dto/user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: UserPaginationDetailDto })
  async findAll(@Query() pagination: PaginationDto) {
    return await this.userService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting user by id' })
  @ApiOkResponse({ type: UserSingleDetailDto })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Creating a new user' })
  @ApiCreatedResponse({ type: ApiResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updating an existing user' })
  @ApiOkResponse({ type: UserSingleDetailDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting an existing user' })
  @ApiOkResponse({ type: ApiResponseDto })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
