import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}
