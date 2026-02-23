import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { AUTH0_EMAIL_KEY } from '../constants/auth0.constants';

interface UserServiceResponse {
  user: User;
}

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('AUTH0_DOMAIN')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: configService.get<string>('AUTH0_DOMAIN'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Record<string, unknown>): Promise<User> {
    const email = payload[AUTH0_EMAIL_KEY];

    if (typeof email !== 'string') {
      throw new UnauthorizedException(
        'Email not found or is not a string in Auth0 payload',
      );
    }

    return this.userService.findOrCreateByAuth0Email(email);
  }
}
