import type { User, UserRole } from '@shared/types/auth';

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}


