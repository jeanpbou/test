import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'graphql';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    Logger.log(
      'Listening at http://localhost:' + port + '/' + globalPrefix,
      'NestApplication',
    );
  });
}

bootstrap();
