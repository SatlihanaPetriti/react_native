import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';

import { Message } from './message.entity';
import { ConversationParticipant } from './conversation-participant.entity';

@Entity('conversations')
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    // false = bisede 1:1, true = grup
    @Column({ default: false })
    isGroup: boolean;

    // emri i grupit, null per biseda 1:1
    @Column({ type: 'varchar', nullable: true })
    name: string | null;

    // userId i krijuesit te grupit, null per biseda 1:1
    @Column({ type: 'int', nullable: true })
    createdBy: number | null;

    @OneToMany(
        () => ConversationParticipant,
        (participant) => participant.conversation,
    )
    participants: ConversationParticipant[];

    @OneToMany(
        () => Message,
        (m) => m.conversation,
    )
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;
}