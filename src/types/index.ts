// src/types/index.ts

export type Role = 'student' | 'admin' | 'superadmin';

export interface User {
  id: number | string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  avatar_url: string | null;
  is_suspended: boolean;
  can_manage_content: boolean;
  can_manage_users: boolean;
  can_approve_admissions: boolean;
  role: Role;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface Pronunciation {
  id: string;
  audio_url: string;
  region: string;
}

export interface Meaning {
  id: string;
  part_of_speech: string;
  definition: string;
  example: string;
}

export interface ThesaurusEntry {
  id: string;
  related_word_text: string;
  relation_type: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface WordObject {
  id: string;
  text: string;
  language: string;
  phonetic_text: string;
  is_sophisticated: boolean;
  difficulty_score: number;
  source_api: string;
  source_reference: string | null;
  word_type: string;
  search_count: number;
  is_active: boolean;
  categories: Category[];
  pronunciations: Pronunciation[];
  meanings: Meaning[];
  thesaurus_entries: ThesaurusEntry[];
  created_at: string;
  updated_at: string;
}

// --- Admin Write Payloads (New for Stage 4) ---

export interface CreateWordPayload {
  text: string;
  language: string;
  phonetic_text?: string;
  is_sophisticated: boolean;
  difficulty_score: number;
  source_api?: string;
  source_reference?: string;
  word_type: string;
  is_active: boolean;
  categories?: string[]; // array of category UUIDs
  meanings?: Omit<Meaning, 'id'>[];
  pronunciations?: Omit<Pronunciation, 'id'>[];
  thesaurus_entries?: { related_word?: string; related_word_text?: string; relation_type: string }[];
}

export type UpdateWordPayload = Partial<CreateWordPayload>;

export type SubEntityType = 'meaning' | 'pronunciation' | 'thesaurus';

export type CategoryPayload = Omit<Category, 'id' | 'created_at'>;

export interface OverrideWotdPayload {
  date: string; // YYYY-MM-DD
  word: string; // UUID
}

export interface OverridePracticePayload {
  date: string; // YYYY-MM-DD
  words: string[]; // Array of 15-20 UUIDs
}

// --- Responses ---

export interface WordOfTheDayResponse {
  id: number | string;
  date: string;
  word: WordObject;
  created_at: string;
}

export interface DailyPracticeResponse {
  id: number | string;
  date: string;
  words: WordObject[];
  created_at: string;
}

export interface SemanticSearchResponse {
  query: string;
  language: string;
  mode: 'semantic';
  results: WordObject[];
}

export interface SearchSuggestionResponse {
  error: string;
  suggestions?: string[];
}

export type SearchResponse = WordObject | SemanticSearchResponse | SearchSuggestionResponse;

export interface AsyncLexiconResponse {
  status: 'preparing';
  ready: false;
  message: string;
}
