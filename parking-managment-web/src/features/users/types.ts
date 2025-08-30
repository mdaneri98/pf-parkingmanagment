// Types for user management (if needed in the future)

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


