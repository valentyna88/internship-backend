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

    const result = await this.userService.findOneByEmail(email);

    if (result) {
      if ('user' in result && result.user) {
        return result.user as User;
      }
      if ('id' in result) {
        return result as unknown as User;
      }
    }

    return this.registerAuth0User(email);
  }

  private async registerAuth0User(email: string): Promise<User> {
    const temporaryPassword = randomBytes(16).toString('hex') + 'A0!';

    const createdResult = (await this.userService.create({
      email,
      password: temporaryPassword,
    })) as UserServiceResponse;

    return createdResult.user;
  }
}
