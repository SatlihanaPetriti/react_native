import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class PhoneLoginDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}