// Types for user management (if needed in the future)
import type { UserDetails } from '@shared/types';

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  userDetail: UserDetails;
}


