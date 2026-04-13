// src/api/services/adminLexicon.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { 
  WordObject, 
  CreateWordPayload, 
  UpdateWordPayload, 
  SubEntityType,
  Category,
  CategoryPayload,
  OverrideWotdPayload,
  OverridePracticePayload,
  WordOfTheDayResponse,
  DailyPracticeResponse
} from '../../types';

export const adminLexiconService = {
  // --- WORDS ---
  listWords: async (params?: { is_sophisticated?: boolean; category_id?: string; search?: string; language?: string; limit?: number }): Promise<WordObject[]> => {
    const { data } = await apiClient.get(`${ENDPOINTS.lexicon.admin.words}list/`, { params });
    return data;
  },

  getWord: async (wordId: string): Promise<WordObject> => {
    const { data } = await apiClient.get(`${ENDPOINTS.lexicon.admin.words}${wordId}/`);
    return data;
  },

  createWord: async (payload: CreateWordPayload): Promise<WordObject> => {
    const { data } = await apiClient.post(ENDPOINTS.lexicon.admin.words, payload);
    return data;
  },

  updateWord: async (wordId: string, payload: UpdateWordPayload): Promise<WordObject> => {
    const { data } = await apiClient.patch(`${ENDPOINTS.lexicon.admin.words}${wordId}/`, payload);
    return data;
  },

  deleteWord: async (wordId: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.lexicon.admin.words}${wordId}/`);
  },

  // --- SUB-ENTITIES ---
  addSubEntity: async (wordId: string, entityType: SubEntityType, payload: any): Promise<WordObject> => {
    const { data } = await apiClient.post(`${ENDPOINTS.lexicon.admin.words}${wordId}/add-${entityType}/`, payload);
    return data;
  },

  removeSubEntity: async (wordId: string, entityType: SubEntityType, entityId: string): Promise<WordObject> => {
    const { data } = await apiClient.delete(`${ENDPOINTS.lexicon.admin.words}${wordId}/remove-${entityType}/${entityId}/`);
    return data;
  },

  // --- CATEGORIES ---
  listCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get(ENDPOINTS.lexicon.admin.categories);
    return data;
  },

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    const { data } = await apiClient.post(ENDPOINTS.lexicon.admin.categories, payload);
    return data;
  },

  updateCategory: async (categoryId: string, payload: CategoryPayload): Promise<Category> => {
    const { data } = await apiClient.patch(`${ENDPOINTS.lexicon.admin.categories}${categoryId}/`, payload);
    return data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.lexicon.admin.categories}${categoryId}/`);
  },

  assignCategory: async (wordId: string, categoryId: string): Promise<WordObject> => {
    const { data } = await apiClient.post(`${ENDPOINTS.lexicon.admin.words}${wordId}/categories/${categoryId}/`);
    return data;
  },

  removeCategory: async (wordId: string, categoryId: string): Promise<WordObject> => {
    const { data } = await apiClient.delete(`${ENDPOINTS.lexicon.admin.words}${wordId}/categories/${categoryId}/`);
    return data;
  },

  // --- OVERRIDES ---
  overrideWotd: async (payload: OverrideWotdPayload): Promise<WordOfTheDayResponse> => {
    const { data } = await apiClient.post(ENDPOINTS.lexicon.admin.overrideWotd, payload);
    return data;
  },

  overridePractice: async (payload: OverridePracticePayload): Promise<DailyPracticeResponse> => {
    const { data } = await apiClient.post(ENDPOINTS.lexicon.admin.overridePractice, payload);
    return data;
  }
};
