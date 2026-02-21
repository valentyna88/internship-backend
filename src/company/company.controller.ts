import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { AllAuthGuard } from '../auth/guards/all-auth.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CompanyPaginationDetailDto } from './dto/company-pagination-detail.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Company } from './entities/company.entity';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.companyService.create(createCompanyDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visible companies' })
  @ApiOkResponse({ type: CompanyPaginationDetailDto })
  async findAll(@Query() pagination: PaginationDto) {
    return await this.companyService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by id' })
  @ApiOkResponse({ type: Company })
  async findOne(@Param('id') id: string) {
    return await this.companyService.findOne(id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update company information' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.companyService.update(id, updateCompanyDto, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @ApiOkResponse({ type: ApiResponseDto })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.companyService.remove(id, req.user.id);
  }
}
