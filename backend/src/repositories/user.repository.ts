import { Repository } from 'typeorm';
import { CustomRepository } from '~/common/decorators';
import { User } from '~/entities';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
