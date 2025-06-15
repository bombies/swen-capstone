import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('One Yaad Marketplace API')
		.setVersion('1.0')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(
		app,
		config,
		{
			operationIdFactory: (_, methodKey) => methodKey,
		},
	);

	SwaggerModule.setup(
		'api',
		app,
		documentFactory,
		{
			jsonDocumentUrl: 'swagger/json',
			swaggerOptions: {
				persistAuthorization: true,
			},
		},
	);

	await app.listen(3001);
}
bootstrap();
