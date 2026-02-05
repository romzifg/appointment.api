import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(11)
    phoneNumber: string;

    @MinLength(8)
    password: string;
}
