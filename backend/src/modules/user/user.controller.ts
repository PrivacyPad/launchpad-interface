import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '~/common/decorators';
import { BearerAuthGuard } from '~/common/guards';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(BearerAuthGuard)
  async me(@ReqUser() user: Express.User) {
    return await this.userService.findById(user.id);
  }
}
