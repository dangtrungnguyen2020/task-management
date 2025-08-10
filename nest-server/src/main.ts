import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main', { timestamp: true });
  const globalPrefix = '/api';

  app.enableCors();
  app.use(helmet());

  app.setGlobalPrefix(globalPrefix);

  // Build the swagger doc only in dev mode
  if (AppModule.isDev) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Tasks API')
      .setDescription('API documentation for Macaron Engine')
      // .setVersion(version)
      .addBearerAuth()
      .build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDoc);
  }

  // Validate query params and body
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Convert exceptions to JSON readable format
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);

  // Log current url of app
  let baseUrl = app.getHttpServer().address().address;
  if (baseUrl === '0.0.0.0' || baseUrl === '::') {
    baseUrl = 'localhost';
  }
  logger.log(`Listening to http://${baseUrl}:${AppModule.port}${globalPrefix}`);
  if (AppModule.isDev) {
    logger.log(
      `Swagger UI: http://${baseUrl}:${AppModule.port}${globalPrefix}/docs`,
    );
  }
}
bootstrap();
