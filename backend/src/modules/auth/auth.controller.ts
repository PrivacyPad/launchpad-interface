import { BadRequestException, Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ethers } from 'ethers';
import { createAuthToken } from '~/utils/jwt';
import { UserService } from '../user';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('generate-payload')
  async generatePayload() {
    try {
      return await this.authService.generatePayload();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to generate payload');
    }
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInRequestDto) {
    const { address, payloadToken, signature, payload } = dto;
    const checksumedAddress = ethers.getAddress(address);

    const isSignatureValid = await this.authService.verifySignature(checksumedAddress, payload, signature);
    if (!isSignatureValid) {
      throw new BadRequestException('Invalid signature');
    }

    const isTokenValid = await this.authService.verifyPayloadToken(payloadToken);
    if (!isTokenValid) {
      throw new BadRequestException('Invalid token');
    }

    const isPayloadValid = await this.authService.verifyPayload(payloadToken, payload);
    if (!isPayloadValid) {
      throw new BadRequestException('Invalid payload hash');
    }

    let user = await this.userService.findByAddress(checksumedAddress);
    if (!user) {
      user = await this.userService.createUser({ address: checksumedAddress });
    }
    user = await this.userService.updateLastLogIn(user.id);

    const token = await createAuthToken({ address: checksumedAddress, id: user.id });

    return { token, user };
  }
}
