import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { createHash, randomBytes } from 'node:crypto';
import { createPayloadToken, verifyToken } from '~/utils/jwt';

@Injectable()
export class AuthService {
  async generatePayload() {
    const randomBytes = this.generateRandomBytes();
    const payloadToken = await createPayloadToken({ randomBytes });
    const payloadTokenHash = createHash('sha256').update(payloadToken).digest('hex');
    return { payloadToken, payloadTokenHash };
  }

  generateRandomBytes(): string {
    return randomBytes(32).toString('hex');
  }

  async verifySignature(address: string, payload: string, signature: string): Promise<boolean> {
    try {
      const message = this.getMessage(payload);
      // Recover the address from the signed message
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return ethers.getAddress(address) === ethers.getAddress(recoveredAddress);
    } catch {
      return false;
    }
  }

  async verifyPayloadToken(token: string) {
    const payload = await verifyToken(token);
    return !!payload;
  }

  async verifyPayload(payloadToken: string, payloadTokenHash: string) {
    return createHash('sha256').update(payloadToken).digest('hex') === payloadTokenHash;
  }

  getMessage(payloadTokenHash: string): string {
    return `PrivacyPad Sign-In\n\nNonce:\n${payloadTokenHash}\n\nPlease sign this message to authenticate.`;
  }
}
