import {Entity,PrimaryGeneratedColumn,ManyToMany,JoinTable,OneToMany,CreateDateColumn,} from 'typeorm';
import { UserEntity } from '../../user/Entity/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => UserEntity)
    @JoinTable({ name: 'conversation_participants' })
    participants: UserEntity[];

    @OneToMany(() => Message, (m) => m.conversation)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;
}