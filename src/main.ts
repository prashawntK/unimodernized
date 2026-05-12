import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { BrandExtractorService } from './brand/brand-extractor.service';
import { AccessibilityService } from './accessibility/accessibility.service';
import { PrismaService } from './common/prisma/prisma.service';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }
    ));
    app.enableCors({
      origin: 'http://localhost:5173',
    });
    await app.listen(process.env.PORT ?? 3000);

    // const brandService = app.get(BrandExtractorService);
    // await brandService.extractBrandFromProject('e9133d3a-76e3-43cb-b787-893a7b1c5b56');
    // console.log('Brand Extraction Done');
    

    // const accessibilityService = app.get(AccessibilityService);
    // const page = await app.get(PrismaService).page.findFirst() ;
    // const violations = page ? await accessibilityService.audit(page.rawHtml, page.url): [];
    // console.log('Violations found:', violations.length);
    // console.log('First violation:', violations[0]);

  }
  bootstrap();
