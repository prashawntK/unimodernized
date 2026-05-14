import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";

@Controller('auth')
export class AuthController{
    constructor(private auth: AuthService){

    }

    @Public()
    @Post('register')
    register(@Body() body :{ email:string, password: string, name?:string}){
        return this.auth.register(body.email, body.password, body.name);
    }

    @Public()
    @Post('login')
    login(@Body() body: {email:string, password:string}){
        return this.auth.login(body.email, body.password);
    }
}