import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

// "+355 69 123 4567" dhe "+355691234567" jane i njejti numer - ruhet vetem forma pa hapesira
const normalizePhone = ({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/[\s().-]/g, '') : value;

export class RequestOtpDto {
    @Transform(normalizePhone)
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;
}

export class VerifyOtpDto {
    @Transform(normalizePhone)
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}
