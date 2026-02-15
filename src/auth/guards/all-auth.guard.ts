import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AllAuthGuard extends AuthGuard(['jwt', 'auth0']) {}
