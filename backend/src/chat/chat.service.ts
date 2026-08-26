import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './Entity/conversation.entity';
import { Message } from './Entity/message.entity';
import { UserEntity } from '../user/Entity/user.entity';
import { MyErrorHandler } from '../ErrorHandler/handleError';
import { CreateMessageDto } from './dto/create-message.dto';
@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) { }
    // krijimi dhe gjetja e nje bisede midis dy perdoruesve
    public async findOrCreateConversation(userAId: number, userBId: number): Promise<Conversation> {
        //merr te gjitha conversation me participants
        const conversations = await this.conversationRepository.find({
            relations: ['participants'],
        });
        // kerko nese conversation ekziston
        const existingConversation = conversations.find((conversation) => {
            // merr vetem id e participants
            const participantIds = conversation.participants.map(
                (participant) => participant.id,
            );
            // kontrollon nese jane te dy user ne conversation
            return (
                participantIds.includes(userAId) && participantIds.includes(userBId)
            );
        });
        // nese ekziston conversation kthejme old conversation ne menyre qe te mos krijohet shume conversations me te njejtin user
        if (existingConversation) {
            return existingConversation;
        }

        try {
            //perndryshe krijojme nje conversation te ri
            const conversation = this.conversationRepository.create({
                participants: [
                    { id: userAId } as UserEntity, // trajto objektin si UserEntity pasi na mjafton id e tij per te krijuar lidhjen ne databaze
                    { id: userBId } as UserEntity,
                ],
            });
            // ruajme ne databaze
            return await this.conversationRepository.save(conversation);
        } catch {
            throw new MyErrorHandler(
                'Failed to create conversation',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    public async isParticipant(conversationId: number, userId: number): Promise<boolean> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conversation) {
            return false;
        }
        return conversation.participants.some(
            (participant) => participant.id === userId,
        );
    }
    //krijo mesazhin dhe ruaje ne databaze
    public async createMessage(params: CreateMessageDto): Promise<Message> {
        try {
            const message = this.messageRepository.create(params);
            return await this.messageRepository.save(message);
        } catch {
            throw new MyErrorHandler(
                'Failed to send message',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    public async getMessages(conversationId: number, userId: number): Promise<Message[]> {
        const isParticipant = await this.isParticipant(conversationId, userId);
        if (!isParticipant) {
            throw new MyErrorHandler(
                'You are not a participant of this conversation',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return await this.messageRepository.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });
    }
    // merr te gjitha conversations nga databaza dhe kthen vetem ato ku user i dhene eshte participant.
    public async getUserConversations(userId: number): Promise<Conversation[]> {
        const conversations = await this.conversationRepository.find({
            relations: ['participants'],
            order: { createdAt: 'DESC' },
        });
        // mbaj vetem conversations ku useri eshte participant
        return conversations.filter((conversation) =>
            // some kontrollojme nese useri eshte pjesemarres ne conversation
            conversation.participants.some((participant) => participant.id === userId),
        );
    }

    public async deleteConversation(conversationId: number, userId: number): Promise<{ message: string; status: HttpStatus }> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });

        // kontrollo nese conversation ekziston
        if (!conversation) {
            throw new MyErrorHandler(
                'Conversation not found',
                HttpStatus.NOT_FOUND,
            );
        }
        // user eshte pjesemarres ne conversation
        const participant = conversation.participants.find(
            (participant) => participant.id === userId,
        );

        if (!participant) {
            throw new MyErrorHandler(
                'You are not a participant of this conversation',
                HttpStatus.UNAUTHORIZED,
            );
        }
        try {
            await this.conversationRepository.remove(conversation);
            return { message: 'Conversation deleted successfully', status: HttpStatus.OK };
        } catch {
            throw new MyErrorHandler(
                'Failed to delete conversation',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}