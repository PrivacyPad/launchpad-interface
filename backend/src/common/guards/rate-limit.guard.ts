import { ThrottlerGuard } from '@nestjs/throttler';

export class RateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ips?.length ? req.ips[0] : req.ip;
    const userId = req.user ? req.user.id : 'guest'; // assuming user has an id property
    return `${ip}-${userId}`; // combining IP and user information
  }
}
