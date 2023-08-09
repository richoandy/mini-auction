import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface DecodedToken {
  user_id: string;
}

// Extend the Request interface to include the decoded token properties
declare global {
    namespace Express {
      interface Request {
        signedInUser?: DecodedToken;
      }
    }
  }
  
const secretKey = process.env.SECRET_KEY;

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;


  // verify token's availability
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
        error_code: 'MISSING_TOKEN',
        message: 'token is missing'
    });
  }
  
  // Verify the token's validity
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secretKey) as DecodedToken;

    // Add the decoded token to the request object for future use
    req.signedInUser = decodedToken;
  } catch (err) {
    if ((err as Error).name == "TokenExpiredError") {
        return res.status(401).json({
            error_code: 'EXPIRED_TOKEN',
            message: 'token is expired'
        });
      }

    return res.status(401).json({
        error_code: 'INVALID_TOKEN',
        message: 'token is invalid'
    });
  }

  next();
};
