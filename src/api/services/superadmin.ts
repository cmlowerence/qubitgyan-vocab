// src/api/services/superadmin.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { User } from '../../types';

export interface SystemHealth {
  status: string;
  version: string;
  database: string;
  uptime_seconds: number;
}

export const superadminService = {
  getSystemHealth: async (): Promise<SystemHealth> => {
    // If backend doesn't return a rich health object, we gracefully handle a basic 200 OK
    try {
      const { data } = await apiClient.get(ENDPOINTS.system.health);
      return data;
    } catch (error) {
      throw new Error('System health check failed');
    }
  },

  listUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get(ENDPOINTS.system.users);
    // Add computed role for UI consistency just like we did in AuthContext
    return data.map((user: any) => ({
      ...user,
      role: user.is_superuser ? 'superadmin' : user.is_staff ? 'admin' : 'student'
    }));
  },

  updateUserAccess: async (userId: string | number, payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch(`${ENDPOINTS.system.users}${userId}/`, payload);
    return {
      ...data,
      role: data.is_superuser ? 'superadmin' : data.is_staff ? 'admin' : 'student'
    };
  },

  deleteUser: async (userId: string | number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.system.users}${userId}/`);
  }
};
