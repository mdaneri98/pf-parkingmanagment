/**
 * User API Service
 * Handles all user-related API calls
 */

import apiClient from '@api/client';
import type { ApiResponse, User, Vehicle } from '@types';

// ============================================================================
// User Service
// ============================================================================

class UserService {
  /**
   * GET /users/me
   * Get current authenticated user's profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  }

  /**
   * GET /users/{id}
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  }

  /**
   * PUT /users/{id}
   * Update user profile
   * User can only update their own profile
   */
  async updateUser(
    userId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
    },
  ): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${userId}`,
      data,
    );
    return response.data.data;
  }

  /**
   * GET /users/{id}/vehicles
   * Get user's registered vehicles
   */
  async getUserVehicles(userId: number): Promise<Vehicle[]> {
    const response = await apiClient.get<ApiResponse<Vehicle[]>>(
      `/users/${userId}/vehicles`,
    );
    return response.data.data;
  }
}

// ============================================================================
// Export
// ============================================================================

export const userService = new UserService();
export default userService;
