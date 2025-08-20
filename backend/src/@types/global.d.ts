import express = require('express');

declare global {
  namespace Express {
    interface User {
      id: number;
      address: string;
    }

    interface Request {
      user?: User | undefined;
    }

    interface AuthenticatedRequest extends Request {
      user: User;
    }

    interface UnauthenticatedRequest extends Request {
      user?: undefined;
    }
  }
}
