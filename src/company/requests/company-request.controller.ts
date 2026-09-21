import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  Delete,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CompanyRequestService } from './company-request.service';
import { AllAuthGuard } from 'src/auth/guards/all-auth.guard';
import {
  CompanyRequestCreatedResponseDto,
  CompanyRequestResponseDto,
} from '../dto/company-request-response.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CompanyRequestPaginationDto } from '../dto/company-pagination-detail.dto';

@ApiTags('Company Requests')
@Controller('companies')
export class CompanyRequestController {
  constructor(private readonly requestService: CompanyRequestService) {}

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get('requests/my')
  @ApiOperation({ summary: 'View my join requests' })
  @ApiOkResponse({ type: CompanyRequestPaginationDto })
  async getMyRequests(
    @Query() pagination: PaginationDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.getMyJoinRequests(req.user.id, pagination);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get('invitations/my')
  @ApiOperation({ summary: 'View my company invitations' })
  @ApiOkResponse({ type: CompanyRequestPaginationDto })
  async getMyInvitations(
    @Query() pagination: PaginationDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.getMyInvitations(req.user.id, pagination);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get(':id/invitations')
  @ApiOperation({ summary: 'View list of invited users' })
  @ApiOkResponse({ type: CompanyRequestPaginationDto })
  async getCompanyInvitations(
    @Param('id') companyId: string,
    @Query() pagination: PaginationDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.getCompanyInvitations(
      companyId,
      req.user.id,
      pagination,
    );
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Get(':id/join-requests')
  @ApiOperation({ summary: 'View list of join requests' })
  @ApiOkResponse({ type: CompanyRequestPaginationDto })
  async getCompanyJoinRequests(
    @Param('id') companyId: string,
    @Query() pagination: PaginationDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.getCompanyJoinRequests(
      companyId,
      req.user.id,
      pagination,
    );
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite user to company' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CompanyRequestCreatedResponseDto })
  async invite(
    @Param('id') companyId: string,
    @Body() inviteDto: InviteUserDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.inviteUser(
      companyId,
      inviteDto.userId,
      req.user.id,
    );
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Post(':id/join')
  @ApiOperation({ summary: 'Send request to join company' })
  @ApiCreatedResponse({ type: CompanyRequestCreatedResponseDto })
  async join(@Param('id') companyId: string, @Req() req: RequestWithUser) {
    return await this.requestService.sendJoinRequest(companyId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Patch('invitations/:requestId/accept')
  @ApiOperation({ summary: 'Accept company invitation' })
  @ApiOkResponse({
    description: 'Invitation accepted successfully',
    type: CompanyRequestResponseDto,
  })
  async acceptInvite(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.acceptInvitation(requestId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Patch('invitations/:requestId/decline')
  @ApiOperation({ summary: 'Decline company invitation' })
  @ApiOkResponse({ type: CompanyRequestResponseDto })
  async declineInvite(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.declineInvitation(requestId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Patch('requests/:requestId/accept')
  @ApiOperation({ summary: 'Owner: Accept join request' })
  @ApiOkResponse({ type: CompanyRequestResponseDto })
  async acceptJoin(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.acceptJoinRequest(requestId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Patch('requests/:requestId/decline')
  @ApiOperation({ summary: 'Owner: Decline join request' })
  @ApiOkResponse({ type: CompanyRequestResponseDto })
  async declineJoin(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.declineJoinRequest(requestId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Delete('invitations/:requestId')
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiOkResponse({ type: ApiResponseDto })
  async cancelInvite(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.cancelInvitation(requestId, req.user.id);
  }

  @UseGuards(AllAuthGuard)
  @ApiBearerAuth()
  @Delete('requests/:requestId/cancel')
  @ApiOperation({ summary: 'Cancel join request' })
  @ApiOkResponse({ type: ApiResponseDto })
  async cancelJoin(
    @Param('requestId') requestId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.requestService.cancelJoinRequest(requestId, req.user.id);
  }
}
