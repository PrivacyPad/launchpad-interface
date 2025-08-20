import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const mockData = {
    address: '0x398C257ec0a776ec722F278F28255B3Dc287223f',
    signature:
      '0x5b0bb4cf653c2c45919b0f741c15d62780aaa47ba8c47bf7a2328fb01501bcba56dcc0d7041e195abac8f69637bedff8ab299eb547ec0c82c9f91f05d5ad8ff61b',
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJyYW5kb21CeXRlcyI6IjJkY2ZjYTJhNGFiMGFmYTg5YTgyOTgwMTA1ZWEwNWExM2ExOGZiMGFkNmYzOGJkZDVlNDczYzY2OWUzNDNmOGYiLCJpYXQiOjE3NTU2NzY3NjUsImV4cCI6MTc1NTY3NzA2NX0.Fa5KdhObIkKYI56sm8wfwc_jDZRGEXlyR_3NOdo8eow',
    nonce: '7ae7ff248f4438f7a41aafc183b41c21598672e4e2a1c9fbebf5997c7e37368a',
  };

  beforeEach(async () => {
    authService = new AuthService();
  });

  describe('generatePayload', () => {
    it('should generate a valid payload', async () => {
      const result = await authService.generatePayload();
      expect(result).toHaveProperty('payloadToken');
      expect(result).toHaveProperty('payloadTokenHash');
    });
  });

  describe('verifySignature', () => {
    it('should verify a valid signature', async () => {
      const result = await authService.verifySignature(mockData.address, mockData.nonce, mockData.signature);
      expect(result).toBe(true);
    });

    it('should return false for an invalid signature', async () => {
      const result = await authService.verifySignature(mockData.address, mockData.nonce, 'invalid_signature');
      expect(result).toBe(false);
    });

    it('should return false for an invalid address', async () => {
      const result = await authService.verifySignature('invalid_address', mockData.nonce, mockData.signature);
      expect(result).toBe(false);
    });

    it('should return false for an invalid nonce', async () => {
      const result = await authService.verifySignature(mockData.address, 'invalid_nonce', mockData.signature);
      expect(result).toBe(false);
    });
  });

  describe('verifyPayloadToken', () => {
    it('should return true for a valid token', async () => {
      const { payloadToken } = await authService.generatePayload();
      const result = await authService.verifyPayloadToken(payloadToken);
      expect(result).toBe(true);
    });

    it('should return false for an invalid token', async () => {
      const result = await authService.verifyPayloadToken('invalid_token');
      expect(result).toBe(false);
    });

    it('should return false for an expired token', async () => {
      const result = await authService.verifyPayloadToken(mockData.token);
      expect(result).toBe(false);
    });
  });

  describe('verifyPayload', () => {
    it('should return true for a valid payload', async () => {
      const { payloadToken, payloadTokenHash } = await authService.generatePayload();
      const result = await authService.verifyPayload(payloadToken, payloadTokenHash);
      expect(result).toBe(true);

      const result2 = await authService.verifyPayload(mockData.token, mockData.nonce);
      expect(result2).toBe(true);
    });

    it('should return false for an invalid payload', async () => {
      const result = await authService.verifyPayload('invalid_payload', mockData.nonce);
      expect(result).toBe(false);
    });

    it('should return false for an invalid hash', async () => {
      const result = await authService.verifyPayload(mockData.token, 'invalid_hash');
      expect(result).toBe(false);
    });
  });
});
