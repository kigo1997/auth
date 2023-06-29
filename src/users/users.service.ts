import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { userId } });

    delete user.password;
    return user;
  }

  async findByEmail(userEmail: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { userEmail } });
  }

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
    };
    const savedUser = await this.userRepository.save(newUser);

    delete savedUser.password;
    return savedUser;
  }

  async update(userId: number, user: User): Promise<User> {
    await this.userRepository.update(userId, user);
    return this.findOne(userId);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
