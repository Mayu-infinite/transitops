import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwt = new JwtService({ secret: process.env.JWT_SECRET || 'secret' });
  app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        (req as any).user = jwt.verify(token);
      } catch {
        return res.status(401).json({ statusCode: 401, message: 'Invalid token' });
      }
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
