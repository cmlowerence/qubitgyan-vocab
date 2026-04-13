// src/components/admin/WordSubEntityManager.tsx

import React, { useState } from 'react';
import { WordObject, SubEntityType } from '../../types';
import { adminLexiconService } from '../../api/services/adminLexicon';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';

interface WordSubEntityManagerProps {
  word: WordObject | null;
  isOpen: boolean;
  onClose: () => void;
  onWordUpdated: (updatedWord: WordObject) => void;
}

export const WordSubEntityManager: React.FC<WordSubEntityManagerProps> = ({ word, isOpen, onClose, onWordUpdated }) => {
  const [activeTab, setActiveTab] = useState<SubEntityType>('meaning');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  // Form States
  const [meaningForm, setMeaningForm] = useState({ part_of_speech: '', definition: '', example: '' });
  const [pronForm, setPronForm] = useState({ audio_url: '', region: 'US' });
  const [thesaurusForm, setThesaurusForm] = useState({ related_word_text: '', relation_type: 'SYN' });

  if (!isOpen || !word) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let payload = {};

    if (activeTab === 'meaning') payload = meaningForm;
    if (activeTab === 'pronunciation') payload = pronForm;
    if (activeTab === 'thesaurus') payload = thesaurusForm;

    try {
      const updatedWord = await adminLexiconService.addSubEntity(word.id as string, activeTab, payload);
      onWordUpdated(updatedWord);
      addToast(`Successfully added ${activeTab}.`, 'success');
      
      // Reset forms
      setMeaningForm({ part_of_speech: '', definition: '', example: '' });
      setPronForm({ audio_url: '', region: 'US' });
      setThesaurusForm({ related_word_text: '', relation_type: 'SYN' });
    } catch (error: any) {
      addToast(error.response?.data?.detail || `Failed to add ${activeTab}.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entityId: string, type: SubEntityType) => {
    if (!window.confirm(`Remove this ${type}?`)) return;
    
    try {
      const updatedWord = await adminLexiconService.removeSubEntity(word.id as string, type, entityId);
      onWordUpdated(updatedWord);
      addToast(`${type} removed successfully.`, 'success');
    } catch (error) {
      addToast(`Failed to remove ${type}.`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-card rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-foreground">Manage Content</h2>
            <p className="text-sm text-muted-foreground capitalize font-medium mt-1">Word: <span className="text-primary">{word.text}</span></p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/30 px-6 pt-2 space-x-6">
          {(['meaning', 'pronunciation', 'thesaurus'] as SubEntityType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'thesaurus' ? 'Related Words' : `${tab}s`}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
          
          {/* Add Form */}
          <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Add New {activeTab === 'thesaurus' ? 'Relation' : activeTab}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              
              {activeTab === 'meaning' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Part of Speech" placeholder="noun, verb, adj..." value={meaningForm.part_of_speech} onChange={e => setMeaningForm({...meaningForm, part_of_speech: e.target.value})} required />
                    <Input label="Example Sentence (Optional)" placeholder="He was very..." value={meaningForm.example} onChange={e => setMeaningForm({...meaningForm, example: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Definition</label>
                    <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-20 resize-none" value={meaningForm.definition} onChange={e => setMeaningForm({...meaningForm, definition: e.target.value})} required />
                  </div>
                </>
              )}

              {activeTab === 'pronunciation' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Audio URL" placeholder="https://..." value={pronForm.audio_url} onChange={e => setPronForm({...pronForm, audio_url: e.target.value})} required type="url" />
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Region</label>
                    <select className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={pronForm.region} onChange={e => setPronForm({...pronForm, region: e.target.value})}>
                      <option value="US">US English</option>
                      <option value="UK">UK English</option>
                      <option value="AU">AU English</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'thesaurus' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Related Word" placeholder="e.g. loquacious" value={thesaurusForm.related_word_text} onChange={e => setThesaurusForm({...thesaurusForm, related_word_text: e.target.value})} required />
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Relation Type</label>
                    <select className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={thesaurusForm.relation_type} onChange={e => setThesaurusForm({...thesaurusForm, relation_type: e.target.value})}>
                      <option value="SYN">Synonym</option>
                      <option value="ANT">Antonym</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading} className="w-auto">Add to Word</Button>
              </div>
            </form>
          </div>

          {/* Existing Entities List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Existing {activeTab === 'thesaurus' ? 'Relations' : `${activeTab}s`}</h3>
            
            {activeTab === 'meaning' && word.meanings?.map(m => (
              <div key={m.id} className="flex justify-between items-start p-4 bg-card border border-border rounded-lg group">
                <div>
                  <span className="text-xs font-bold text-accent italic">{m.part_of_speech}</span>
                  <p className="text-sm font-medium text-foreground mt-1">{m.definition}</p>
                  {m.example && <p className="text-xs text-muted-foreground mt-1 italic">"{m.example}"</p>}
                </div>
                <button onClick={() => handleDelete(m.id as string, 'meaning')} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}

            {activeTab === 'pronunciation' && word.pronunciations?.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-card border border-border rounded-lg group">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded uppercase">{p.region}</span>
                  <a href={p.audio_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline truncate max-w-[200px] sm:max-w-xs">{p.audio_url}</a>
                </div>
                <button onClick={() => handleDelete(p.id as string, 'pronunciation')} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}

            {activeTab === 'thesaurus' && word.thesaurus_entries?.map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 bg-card border border-border rounded-lg group">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${t.relation_type === 'SYN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.relation_type}</span>
                  <span className="text-sm font-medium">{t.related_word_text}</span>
                </div>
                <button onClick={() => handleDelete(t.id as string, 'thesaurus')} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}

            {((activeTab === 'meaning' && (!word.meanings || word.meanings.length === 0)) ||
              (activeTab === 'pronunciation' && (!word.pronunciations || word.pronunciations.length === 0)) ||
              (activeTab === 'thesaurus' && (!word.thesaurus_entries || word.thesaurus_entries.length === 0))) && (
              <div className="text-center p-6 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                No {activeTab === 'thesaurus' ? 'related words' : `${activeTab}s`} added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
