import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  /// Create an instance of this application
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
