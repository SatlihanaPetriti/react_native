import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    // userId e pjesemarresve, pervec krijuesit qe shtohet automatikisht
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    participantIds: number[];
}