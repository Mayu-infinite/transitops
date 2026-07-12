import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser>(
    err: unknown,
    user: TUser | false | null,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser {
    if (err instanceof Error) {
      this.logger.error('JWT authentication failed.', err.stack);

      throw err;
    }

    if (err) {
      this.logger.error('JWT authentication failed.');

      throw new UnauthorizedException('Authentication failed.');
    }

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    return user;
  }
}
