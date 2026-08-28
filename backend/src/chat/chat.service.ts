import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Conversation } from './Entity/conversation.entity';
import { Message } from './Entity/message.entity';
import { ConversationParticipant } from './Entity/conversation-participant.entity';
import { MyErrorHandler } from '../ErrorHandler/handleError';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateGroupDto } from './dto/create-group.dto';

// Mesazhi bashke me statusin e leximit per çdo pjesemarres tjeter
export type MessageWithReadStatus = Message & { readBy: number[] };

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

    // Krijon ose gjen nje bisede 1:1 midis dy user (asnjehere grup)
    public async findOrCreateConversation(userAId: number, userBId: number): Promise<Conversation> {

        // Merr vetem bisedat 1:1 aktive te userit A
        const userAParticipations = await this.participantRepository.find({
            where: { userId: userAId, deletedAt: IsNull() },
            relations: ['conversation'],
        });

        const directConversations = userAParticipations.filter(
            (participant) => !participant.conversation.isGroup,
        );

        for (const participation of directConversations) {
            const otherParticipant = await this.participantRepository.findOne({
                where: {
                    conversationId: participation.conversationId,
                    userId: userBId,
                },
            });

            if (otherParticipant) {
                // Nese userB e kishte fshire biseden me pare, e rikthejme
                if (otherParticipant.deletedAt) {
                    otherParticipant.deletedAt = null;
                    await this.participantRepository.save(otherParticipant);
                }

                return participation.conversation;
            }
        }

        try {
            const conversation = this.conversationRepository.create({
                isGroup: false,
            });

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

    // Krijon nje grup me disa pjesemarres. Krijuesi behet admin automatikisht
    public async createGroupConversation(
        creatorId: number,
        dto: CreateGroupDto,
    ): Promise<Conversation> {

        try {
            const conversation = this.conversationRepository.create({
                isGroup: true,
                name: dto.name,
                createdBy: creatorId,
            });

            const savedConversation =
                await this.conversationRepository.save(conversation);

            // Bashko krijuesin me pjesemarresit e derguar, pa duplikate
            const participantIds = Array.from(
                new Set([creatorId, ...dto.participantIds]),
            );

            const participants = participantIds.map((userId) =>
                this.participantRepository.create({
                    conversationId: savedConversation.id,
                    userId,
                    isAdmin: userId === creatorId,
                    deletedAt: null,
                }),
            );

            await this.participantRepository.save(participants);

            return savedConversation;

        } catch {
            throw new MyErrorHandler(
                'Failed to create group',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // Shton nje pjesemarres te ri ne grup. Cdo pjesemarres aktual mund te ftoje te tjere
    public async addParticipant(
        conversationId: number,
        requesterId: number,
        newUserId: number,
    ): Promise<{ message: string }> {

        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });

        if (!conversation || !conversation.isGroup) {
            throw new MyErrorHandler('Group not found', HttpStatus.NOT_FOUND);
        }

        const requester = await this.participantRepository.findOne({
            where: { conversationId, userId: requesterId, deletedAt: IsNull() },
        });

        if (!requester) {
            throw new MyErrorHandler(
                'You are not a participant of this group',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const existing = await this.participantRepository.findOne({
            where: { conversationId, userId: newUserId },
        });

        if (existing) {
            if (!existing.deletedAt) {
                throw new MyErrorHandler(
                    'User is already in the group',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Useri kishte dale me pare nga grupi, e rikthejme
            existing.deletedAt = null;
            await this.participantRepository.save(existing);

            return { message: 'Participant re-added successfully' };
        }

        const participant = this.participantRepository.create({
            conversationId,
            userId: newUserId,
            isAdmin: false,
            deletedAt: null,
        });

        await this.participantRepository.save(participant);

        return { message: 'Participant added successfully' };
    }

    // Heq nje pjesemarres nga grupi. Vetem admini mund te heqe te tjeret,
    // por çdokush mund te dali vet nga grupi
    public async removeParticipant(
        conversationId: number,
        requesterId: number,
        targetUserId: number,
    ): Promise<{ message: string }> {

        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });

        if (!conversation || !conversation.isGroup) {
            throw new MyErrorHandler('Group not found', HttpStatus.NOT_FOUND);
        }

        const isLeavingSelf = requesterId === targetUserId;

        if (!isLeavingSelf) {
            const requester = await this.participantRepository.findOne({
                where: { conversationId, userId: requesterId, deletedAt: IsNull() },
            });

            if (!requester?.isAdmin) {
                throw new MyErrorHandler(
                    'Only admins can remove other participants',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        }

        const target = await this.participantRepository.findOne({
            where: { conversationId, userId: targetUserId, deletedAt: IsNull() },
        });

        if (!target) {
            throw new MyErrorHandler(
                'Participant not found',
                HttpStatus.NOT_FOUND,
            );
        }

        target.deletedAt = new Date();
        await this.participantRepository.save(target);

        return { message: 'Participant removed successfully' };
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

    // Merr mesazhet e nje conversation, bashke me statusin e leximit per secilin
    public async getMessages(
        conversationId: number,
        userId: number,
    ): Promise<MessageWithReadStatus[]> {

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

        const messages = await this.messageRepository.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });

        const participants = await this.participantRepository.find({
            where: { conversationId, deletedAt: IsNull() },
        });

        // Per çdo mesazh, gjej cilet pjesemarres (pervec derguesit) e kane
        // lexuar - dmth lastReadAt e tyre eshte pas krijimit te mesazhit
        return messages.map((message) => {
            const readBy = participants
                .filter(
                    (participant) =>
                        participant.userId !== message.senderId &&
                        participant.lastReadAt &&
                        participant.lastReadAt >= message.createdAt,
                )
                .map((participant) => participant.userId);

            return { ...message, readBy };
        });
    }

    // Shenon biseden si "e lexuar" per userin aktual deri ne kete moment.
    // Perdoret per checkmark-at blu si ne WhatsApp
    public async markAsRead(
        conversationId: number,
        userId: number,
    ): Promise<{ conversationId: number; userId: number; readAt: Date }> {

        const participant = await this.participantRepository.findOne({
            where: { conversationId, userId, deletedAt: IsNull() },
        });

        if (!participant) {
            throw new MyErrorHandler(
                'You are not a participant of this conversation',
                HttpStatus.UNAUTHORIZED,
            );
        }

        participant.lastReadAt = new Date();
        await this.participantRepository.save(participant);

        return {
            conversationId,
            userId,
            readAt: participant.lastReadAt,
        };
    }

    // Merr conversations e user-it (1:1 dhe grupe)
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

    // Fshin conversation vetem per user-in aktual (per grup = del nga grupi)
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