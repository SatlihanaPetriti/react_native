import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;
}

export class VerifyOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}
