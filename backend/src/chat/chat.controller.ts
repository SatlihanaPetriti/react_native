import { Body, Controller, Get, Post, Param, Req, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('start/:userId')
    public async startConversation(@Param('userId') userId: string, @Req() req: any) {
        return this.chatService.findOrCreateConversation(req.user.id, parseInt(userId));
    }

    @Post('group')
    public async createGroup(@Body() dto: CreateGroupDto, @Req() req: any) {
        return this.chatService.createGroupConversation(req.user.id, dto);
    }

    @Get('conversations')
    public async getConversations(@Req() req: any) {
        return this.chatService.getUserConversations(req.user.id);
    }

    @Get('conversations/:id/messages')
    public async getMessages(@Param('id') id: string, @Req() req: any) {
        return this.chatService.getMessages(parseInt(id), req.user.id);
    }

    @Post('conversations/:id/read')
    public async markAsRead(@Param('id') id: string, @Req() req: any) {
        return this.chatService.markAsRead(parseInt(id), req.user.id);
    }

    @Post('conversations/:id/participants')
    public async addParticipant(
        @Param('id') id: string,
        @Body() dto: AddParticipantDto,
        @Req() req: any,
    ) {
        return this.chatService.addParticipant(parseInt(id), req.user.id, dto.userId);
    }

    @Delete('conversations/:id/participants/:userId')
    public async removeParticipant(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Req() req: any,
    ) {
        return this.chatService.removeParticipant(
            parseInt(id),
            req.user.id,
            parseInt(userId),
        );
    }

    @Delete('conversations/:id')
    public async deleteConversation(@Param('id') id: string, @Req() req: any) {
        return this.chatService.deleteConversation(parseInt(id), req.user.id);
    }
}