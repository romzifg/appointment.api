import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-input.dto';
import { LoginUserDto } from './dto/login-input.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() input: RegisterUserDto) {
        return this.authService.register(input);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() input: LoginUserDto) {
        return this.authService.login(input);
    }

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    async validateToken(@Body('token') token: string) {
        return this.authService.validateToken(token);
    }
}