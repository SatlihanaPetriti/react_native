import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ default: 'user' })
    role: string;
}