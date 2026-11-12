import type { Request, Response, NextFunction } from 'express';
export declare function generateToken(payload: object): string;
export declare function verifyToken(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=jwt.d.ts.map