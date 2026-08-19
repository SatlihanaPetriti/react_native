import { IsEmail, IsString, MinLength, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UserDto {
    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}