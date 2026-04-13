// src/api/services/lexicon.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { 
  WordOfTheDayResponse, 
  DailyPracticeResponse, 
  SearchResponse, 
  AsyncLexiconResponse,
  WordObject
} from '../../types';

export const lexiconService = {
  getWordOfTheDay: async (): Promise<WordOfTheDayResponse | AsyncLexiconResponse> => {
    const { data, status } = await apiClient.get(ENDPOINTS.lexicon.public.wotd);
    if (status === 202) return data as AsyncLexiconResponse;
    return data as WordOfTheDayResponse;
  },

  getDailyPractice: async (): Promise<DailyPracticeResponse | AsyncLexiconResponse> => {
    const { data, status } = await apiClient.get(ENDPOINTS.lexicon.public.practice);
    if (status === 202) return data as AsyncLexiconResponse;
    return data as DailyPracticeResponse;
  },

  search: async (word: string, lang: string = 'en'): Promise<SearchResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.lexicon.public.search, {
      params: { word, lang }
    });
    return data;
  },

  getTrending: async (): Promise<WordObject[]> => {
    const { data } = await apiClient.get(ENDPOINTS.lexicon.public.trending);
    return data;
  }
};
