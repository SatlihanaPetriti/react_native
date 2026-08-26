import { Controller, Get, Post, Param, Req, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('start/:userId')
    public async startConversation(@Param('userId') userId: string, @Req() req: any) {
        return this.chatService.findOrCreateConversation(req.user.id, parseInt(userId));
    }

    @Get('conversations')
    public async getConversations(@Req() req: any) {
        return this.chatService.getUserConversations(req.user.id);
    }

    @Get('conversations/:id/messages')
    public async getMessages(@Param('id') id: string, @Req() req: any) {
        return this.chatService.getMessages(parseInt(id), req.user.id);
    }
    @Delete('conversations/:id')
    public async deleteConversation(@Param('id') id: string, @Req() req: any) {
        return this.chatService.deleteConversation(parseInt(id), req.user.id);
    }
}