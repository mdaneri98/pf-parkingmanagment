import type { User, UserRole } from '@shared/types/auth';

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// API response from backend - aligns with User interface
export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  // Note: Backend doesn't return role in user endpoint
  // Role comes from JWT token instead
}

// Complete user profile with role - unified interface
export interface UserProfile extends User {
  // Extends the unified User interface
  // Can add profile-specific fields here if needed
}
