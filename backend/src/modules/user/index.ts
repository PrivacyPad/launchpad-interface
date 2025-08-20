import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmExModule } from '../typeorm-ex';
import { UserRepository } from '~/repositories';
import { config } from '~/config';
import { UserController } from './user.controller';

@Module({
  imports: [HttpModule, TypeOrmExModule.forCustomRepository([UserRepository], config.DATABASE_NAME)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

export { UserService };
