import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { IsNull } from 'typeorm';
import { User } from '~/entities';
import { UserRepository } from '~/repositories';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {
    this.logger.debug('UserService initialized');
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const exists = await this.findByAddress(dto.address);
    if (exists) {
      throw new Error('User already exists');
    }
    return this.userRepository.save(dto);
  }

  async findByAddress(address: string) {
    return await this.userRepository.findOne({
      where: { address: ethers.getAddress(address), deletedAt: IsNull() },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async updateLastLogIn(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.lastLogin = new Date();
    return await this.userRepository.save(user);
  }
}
