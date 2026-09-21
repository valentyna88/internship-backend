import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyRequest } from './entities/company-request.entity';
import { CompanyRequestService } from './requests/company-request.service';
import { CompanyRequestController } from './requests/company-request.controller';
import { CompanyMemberController } from './members/company-member.controller';
import { CompanyMemberService } from './members/company-member.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyRequest, User])],
  controllers: [
    CompanyController,
    CompanyRequestController,
    CompanyMemberController,
  ],
  providers: [CompanyService, CompanyRequestService, CompanyMemberService],
})
export class CompanyModule {}
