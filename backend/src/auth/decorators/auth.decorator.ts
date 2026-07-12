import { applyDecorators, UseGuards } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Auth(...roles: Role[]) {
  const decorators = [UseGuards(JwtAuthGuard)];

  return applyDecorators(...decorators);
}
