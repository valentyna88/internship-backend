import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AllAuthGuard } from 'src/auth/guards/all-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { CompanyMemberService } from './company-member.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserPaginationDetailDto } from 'src/user/dto/user-pagination.dto';

@ApiTags('Company Members')
@Controller('companies')
export class CompanyMemberController {
  constructor(private readonly memberService: CompanyMemberService) {}

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get(':id/members')
  @ApiOperation({ summary: 'View list of users in company' })
  @ApiOkResponse({ type: UserPaginationDetailDto })
  async getMembers(
    @Param('id') companyId: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.memberService.getCompanyMembers(companyId, pagination);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/leave')
  @ApiOperation({ summary: 'User leaves company' })
  @ApiOkResponse({ type: ApiResponseDto })
  async leave(@Param('id') companyId: string, @Req() req: RequestWithUser) {
    return await this.memberService.leaveCompany(companyId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Owner removes user from company' })
  @ApiOkResponse({ type: ApiResponseDto })
  async removeUser(
    @Param('id') companyId: string,
    @Param('userId') targetUserId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.memberService.removeUserFromCompany(
      companyId,
      targetUserId,
      req.user.id,
    );
  }
}
