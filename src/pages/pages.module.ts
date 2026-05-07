import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PagesService } from './pages.service';


@Module({
    imports : [PrismaModule],
    providers: [PagesService],
    exports : [PagesService],
})
export class PagesModule{}