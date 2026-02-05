import {
    IsString,
    IsEmail,
    MinLength,
    IsOptional,
} from 'class-validator';

export class EditUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(11)
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @MinLength(8)
    password?: string;
}
