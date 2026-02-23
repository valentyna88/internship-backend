import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { AUTH0_EMAIL_KEY } from '../constants/auth0.constants';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');

    if (!domain || !audience) {
      throw new InternalServerErrorException(
        'Auth0 configuration is missing in environment variables. Please check AUTH0_DOMAIN and AUTH0_AUDIENCE.',
      );
    }
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${domain}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: domain,
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
