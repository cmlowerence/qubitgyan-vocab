// src/components/admin/WordFormModal.tsx

import React, { useState, useEffect } from 'react';
import { CreateWordPayload, WordObject, Category } from '../../types';
import { adminLexiconService } from '../../api/services/adminLexicon';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface WordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateWordPayload) => Promise<void>;
  initialData?: WordObject | null;
}

export const WordFormModal: React.FC<WordFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CreateWordPayload>({
    text: '',
    language: 'en',
    phonetic_text: '',
    is_sophisticated: false,
    difficulty_score: 0.5,
    word_type: 'WORD',
    is_active: true,
    source_api: 'MANUAL',
    source_reference: '',
    categories: [],
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available categories when modal opens
  useEffect(() => {
    if (isOpen) {
      adminLexiconService.listCategories()
        .then(data => setCategories(data))
        .catch(err => console.error("Failed to load categories for modal", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        text: initialData.text,
        language: initialData.language,
        phonetic_text: initialData.phonetic_text || '',
        is_sophisticated: initialData.is_sophisticated,
        difficulty_score: initialData.difficulty_score,
        word_type: initialData.word_type,
        is_active: initialData.is_active,
        source_api: initialData.source_api || 'MANUAL',
        source_reference: initialData.source_reference || '',
        categories: initialData.categories?.map(c => c.id) || [],
      });
    } else {
      // Reset on new
      setFormData({
        text: '', language: 'en', phonetic_text: '', is_sophisticated: false,
        difficulty_score: 0.5, word_type: 'WORD', is_active: true, source_api: 'MANUAL', 
        source_reference: '', categories: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = formData.categories || [];
    if (current.includes(categoryId)) {
      setFormData({ ...formData, categories: current.filter(id => id !== categoryId) });
    } else {
      setFormData({ ...formData, categories: [...current, categoryId] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Word' : 'Create New Word'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-muted p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="word-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Word Text" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
              <Input label="Phonetic Text" placeholder="e.g. ˈɡærələs" value={formData.phonetic_text} onChange={e => setFormData({...formData, phonetic_text: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input label="Language" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} required />
              <Input label="Difficulty (0.0 to 1.0)" type="number" step="0.01" min="0" max="1" value={formData.difficulty_score} onChange={e => setFormData({...formData, difficulty_score: parseFloat(e.target.value)})} required />
              <Input label="Source Reference" placeholder="e.g. mw+fda" value={formData.source_reference} onChange={e => setFormData({...formData, source_reference: e.target.value})} />
            </div>

            <div className="flex flex-col space-y-3 p-4 border border-border rounded-lg bg-muted/20">
              <span className="text-sm font-semibold text-foreground">Word Categories</span>
              {categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input 
                        type="checkbox" 
                        checked={(formData.categories || []).includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">No categories found in system.</span>
              )}
            </div>

            <div className="flex space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_sophisticated} 
                  onChange={e => setFormData({...formData, is_sophisticated: e.target.checked})}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Is Sophisticated</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Active (Visible)</span>
              </label>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-border flex justify-end space-x-3 bg-card rounded-b-xl">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="w-auto px-6">Cancel</Button>
          <Button form="word-form" type="submit" isLoading={isLoading} className="w-auto px-8">Save Word</Button>
        </div>
      </div>
    </div>
  );
};
