import { RoleUser } from '@prisma/client';
import { Request } from 'express';

export interface IJwtPayload {
  id: string;
  username: string;
  role: RoleUser;
}

export interface IAunthenticateRequest extends Request {
  user?: IJwtPayload;
  isPublic?: boolean;
}
