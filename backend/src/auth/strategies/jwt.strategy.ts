import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    try {
      this.logger.debug(
        `Validating JWT for user id: ${payload.sub} (${payload.email})`,
      );

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        this.logger.warn(
          `JWT validation failed. User with id ${payload.sub} does not exist.`,
        );

        throw new UnauthorizedException('Invalid authentication token.');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Unexpected error while validating JWT.', error);

      throw new InternalServerErrorException(
        'Unable to validate authentication token.',
      );
    }
  }
}
