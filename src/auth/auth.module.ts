import { Module } from "@nestjs/common";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";

@Module({

    imports:[
        PrismaModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config:ConfigService) =>({
                secret:config.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '7d'}
            })
        }),
    ],
    controllers:[AuthController],
    providers:[
        AuthService,
        {provide: APP_GUARD, useClass: JWTAuthGuard},
    ],

})
export class AuthModule{}