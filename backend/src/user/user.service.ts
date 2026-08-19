import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './Entity/user.entity';
import { UserDto } from './DTO/user.dto';
import { HttpStatus } from '@nestjs/common';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }


    public async create(userDto: UserDto): Promise<UserEntity> {
        try {
            // const user = this.userRepository.create(userDto)
            return await this.userRepository.save(userDto)
        } catch (error) {
            throw new MyErrorHandler('Failed to create user', HttpStatus.BAD_REQUEST);  //400      
        }
    }

    public async findAll(): Promise<UserEntity[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new MyErrorHandler('Failed to get users', HttpStatus.BAD_REQUEST) //400
        }
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new MyErrorHandler('User not found', HttpStatus.NOT_FOUND); //404
        }
        return user;
    }

    public async findByEmailOrNull(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    public async findOne(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new MyErrorHandler('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    public async createByPhone(phoneNumber: string, name?: string): Promise<UserEntity> {
        try {
            const user = this.userRepository.create({
                phoneNumber,
                name: name || 'New User',
            });
            return await this.userRepository.save(user);
        } catch (error) {
            throw new MyErrorHandler('Failed to create user', HttpStatus.BAD_REQUEST);
        }
    }

    public async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { phoneNumber } });
    }


}