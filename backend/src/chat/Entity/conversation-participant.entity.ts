import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UserEntity } from '../../user/Entity/user.entity';

@Entity('conversation_participants')
export class ConversationParticipant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    conversationId: number;

    @Column()
    userId: number;

    @Column({ type: 'datetime', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(
        () => Conversation,
        (conversation) => conversation.participants,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @ManyToOne(
        () => UserEntity,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}