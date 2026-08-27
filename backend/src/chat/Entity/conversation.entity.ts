import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';

import { Message } from './message.entity';
import { ConversationParticipant } from './conversation-participant.entity';

@Entity('conversations')
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

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