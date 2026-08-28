import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/Entity/user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'senderId' })
    sender: UserEntity;

    @Column()
    senderId: number;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    // SHENIM: fusha "isRead" u hoq. Ne grup, mesazhi lexohet nga secili user ne
    // kohe te ndryshme, prandaj statusi i leximit nuk mund te jete nje boolean
    // i vetem ne mesazh. Ai llogaritet dinamikisht ne ChatService.getMessages(),
    // duke krahasuar message.createdAt me lastReadAt te secilit participant.
}