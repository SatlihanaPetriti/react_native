import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './Entity/conversation.entity';
import { Message } from './Entity/message.entity';
import { ConversationParticipant } from './Entity/conversation-participant.entity';
import { IsNull } from 'typeorm';
import { MyErrorHandler } from '../ErrorHandler/handleError';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(ConversationParticipant)
        private readonly participantRepository: Repository<ConversationParticipant>,
    ) { }

    // Krijon ose gjen nje conversation midis dy user
    public async findOrCreateConversation(userAId: number, userBId: number): Promise<Conversation> {

        const participants = await this.participantRepository.find({
            relations: ['conversation'],
        });

        const existingConversation = participants.find(
            (participant) => participant.userId === userAId,
        );

        if (existingConversation) {
            const otherParticipant =
                await this.participantRepository.findOne({
                    where: {
                        conversationId: existingConversation.conversationId,
                        userId: userBId,
                    },
                });

            if (otherParticipant) {
                return existingConversation.conversation;
            }
        }

        try {
            const conversation =
                this.conversationRepository.create();

            const savedConversation =
                await this.conversationRepository.save(conversation);

            const participantA =
                this.participantRepository.create({
                    conversationId: savedConversation.id,
                    userId: userAId,
                    deletedAt: null,
                });

            const participantB =
                this.participantRepository.create({
                    conversationId: savedConversation.id,
                    userId: userBId,
                    deletedAt: null,
                });

            await this.participantRepository.save([
                participantA,
                participantB,
            ]);

            return savedConversation;

        } catch {
            throw new MyErrorHandler(
                'Failed to create conversation',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // Kontrollon nese user-i eshte participant i conversation
    public async isParticipant(
        conversationId: number,
        userId: number,
    ): Promise<boolean> {

        const participant = await this.participantRepository.findOne({
            where: {
                conversationId,
                userId,
                deletedAt: IsNull(),
            },
        });

        return !!participant;
    }

    // Krijon dhe ruan mesazhin
    public async createMessage(
        params: CreateMessageDto,
    ): Promise<Message> {

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

    // Merr mesazhet e nje conversation
    public async getMessages(conversationId: number, userId: number): Promise<Message[]> {

        const isParticipant = await this.isParticipant(
            conversationId,
            userId,
        );

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

    // Merr conversations e user-it
    public async getUserConversations(
        userId: number,
    ): Promise<Conversation[]> {

        const participants = await this.participantRepository.find({
            where: {
                userId,
                deletedAt: IsNull(),
            },
            relations: ['conversation', 'conversation.participants'],
            order: {
                conversation: {
                    createdAt: 'DESC',
                },
            },
        });

        return participants.map(
            (participant) => participant.conversation,
        );
    }

    // Fshin conversation vetem per user-in aktual
    public async deleteConversation(
        conversationId: number,
        userId: number,
    ): Promise<{ message: string }> {

        const participant = await this.participantRepository.findOne({
            where: {
                conversationId,
                userId,
                deletedAt: IsNull(),
            },
        });

        // Kontrollo nese user-i eshte participant
        if (!participant) {
            throw new MyErrorHandler(
                'Conversation not found',
                HttpStatus.NOT_FOUND,
            );
        }

        try {
            participant.deletedAt = new Date();

            await this.participantRepository.save(participant);

            return {
                message: 'Conversation deleted successfully',
            };

        } catch {
            throw new MyErrorHandler(
                'Failed to delete conversation',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}