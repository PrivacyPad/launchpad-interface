import { createInterface } from 'readline';
import { createAuthToken } from '~/utils/jwt';

// ts-node -r tsconfig-paths/register src/scripts/generate-jwt.script.ts

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserId() {
  return new Promise<string[]>((resolve) => {
    rl.question('Enter userId|address: ', (input) => {
      rl.close();
      resolve(input.split('|'));
    });
  });
}

async function generateJwt() {
  try {
    const [userId, address] = await getUserId();
    const jwt = await createAuthToken({ id: Number(userId), address });
    console.log(`Generated JWT for user id ${userId}: \n${jwt}`);
  } catch (error) {
    console.error('Error generating JWT:', error);
  }
}

generateJwt();
