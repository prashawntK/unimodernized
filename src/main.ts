import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { BrandExtractorService } from './brand/brand-extractor.service';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }
    ));
    await app.listen(process.env.PORT ?? 3000);

    // const brandService = app.get(BrandExtractorService);
    // await brandService.extractBrandFromProject('e9133d3a-76e3-43cb-b787-893a7b1c5b56');
    // console.log('Brand Extraction Done');
    

  }
  bootstrap();
