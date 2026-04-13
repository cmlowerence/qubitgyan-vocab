// src/api/services/auth.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Tokens } from '../../types';

export const authService = {
  login: async (email: string, password: string): Promise<Tokens> => {
    const { data } = await apiClient.post<Tokens>(ENDPOINTS.auth.login, {
      email,
      password,
    });
    return data;
  },
};
