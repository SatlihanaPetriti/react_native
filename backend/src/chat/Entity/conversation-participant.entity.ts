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

    // admin i grupit (mund te shtoje/heqe participante). Per biseda 1:1 mbetet false
    @Column({ default: false })
    isAdmin: boolean;

    // koha e fundit qe useri ka hapur/lexuar bisedën - perdoret per te llogaritur "read"
    @Column({ type: 'datetime', nullable: true })
    lastReadAt: Date | null;

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