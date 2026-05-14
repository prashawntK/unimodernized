import { Injectable, UnauthorizedException, ConflictException   } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'    

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ){}

    async register(email:string, password:string, name?:string){

        const existing = await this.prisma.user.findUnique({where:{email}});
        if(existing) throw new ConflictException('Email already Registered');

        const hashed = await bcrypt.hash(password,10);
        const user = await this.prisma.user.create({
            data:{
                email, password:hashed, name,
            }
        })
        return this.signToken(user.id, user.email);

    }

    async login(email:string, password:string){
        const user = await this.prisma.user.findUnique({where:{email}});
        if(!user) throw new UnauthorizedException('Invalid Credentials');

        const valid = await bcrypt.compare(password,user.password);
        if(!valid) throw new UnauthorizedException('Invalid Credentials');

        return this.signToken(user.id, user.email);
    }

    private async signToken(userId:string, email:string){
        const access_token = await this.jwt.signAsync({sub:userId, email});
        return {access_token};
    }

}