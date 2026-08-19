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

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}