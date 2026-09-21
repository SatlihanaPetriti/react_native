import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    email: string;
}
