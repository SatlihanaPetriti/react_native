import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsInt()
    conversationId: number;

    @IsInt()
    senderId: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}