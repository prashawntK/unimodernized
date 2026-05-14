import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Observable } from "rxjs";

@Injectable()
export class JWTAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwt: JwtService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        //Check Public
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if(isPublic) return true;

        //Get Request
        const request = context.switchToHttp().getRequest();

        //Extract header
        const header = request.headers.authorization;
        if(!header) throw new UnauthorizedException('No token');

        //Pull token
        const [scheme, token] = header.split(' ');
        if (scheme!== 'Bearer' || !token){
            throw new UnauthorizedException(' Bad Authorization Header');
        }

        //Verify
        try{
            const payload = await this.jwt.verifyAsync(token);
            request.user = payload;
        } catch{
            throw new UnauthorizedException('Invalid token');
        }
        
        //allow
        return true;
        
    }





}