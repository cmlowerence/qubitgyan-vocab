import React, { useEffect, useRef, useState } from 'react';
import { adminLexiconService } from '../../api/services/adminLexicon';
import { WordObject, CreateWordPayload } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { WordFormModal } from '../../components/admin/WordFormModal';
import { WordSubEntityManager } from '../../components/admin/WordSubEntityManager';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../hooks/useToast';

export const WordManager = () => {
  const [words, setWords] = useState<WordObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { addToast } = useToast();
  const fetchRequestRef = useRef(0);

  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordObject | null>(null);

  const [isSubEntityModalOpen, setIsSubEntityModalOpen] = useState(false);
  const [managingWord, setManagingWord] = useState<WordObject | null>(null);

  useEffect(() => {
    const requestId = ++fetchRequestRef.current;

    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const data = await adminLexiconService.listWords({ search: debouncedSearch, limit: 50 });
        if (requestId !== fetchRequestRef.current) return;
        setWords(data);
      } catch {
        if (requestId !== fetchRequestRef.current) return;
        addToast('Failed to fetch words from server.', 'error');
      } finally {
        if (requestId === fetchRequestRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchWords();

    return () => {
      fetchRequestRef.current += 1;
    };
  }, [debouncedSearch, addToast]);

  const handleDelete = async (id: string, text: string) => {
    if (!window.confirm(`Are you sure you want to delete "${text}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminLexiconService.deleteWord(id);
      setWords((currentWords) => currentWords.filter((w) => w.id !== id));
      addToast(`"${text}" deleted successfully.`, 'success');
    } catch {
      addToast('Failed to delete word.', 'error');
    }
  };

  const handleBaseModalSubmit = async (payload: CreateWordPayload) => {
    try {
      if (editingWord) {
        const updated = await adminLexiconService.updateWord(editingWord.id as string, payload);
        setWords((currentWords) => currentWords.map((w) => (w.id === updated.id ? updated : w)));
        addToast('Word updated successfully.', 'success');
      } else {
        const created = await adminLexiconService.createWord(payload);
        setWords((currentWords) => [created, ...currentWords]);
        addToast('New word created successfully.', 'success');
      }
    } catch (error: any) {
      addToast(error.response?.data?.detail || 'Failed to save word.', 'error');
      throw error;
    }
  };

  const handleWordContentUpdated = (updatedWord: WordObject) => {
    setManagingWord(updatedWord);
    setWords((currentWords) => currentWords.map((w) => (w.id === updatedWord.id ? updatedWord : w)));
  };

  const openCreateModal = () => {
    setEditingWord(null);
    setIsBaseModalOpen(true);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Word Database</h1>
          <p className="text-sm text-muted-foreground">Manage the entire lexicon dictionary.</p>
        </div>
        <Button className="sm:w-auto shadow-sm" onClick={openCreateModal}>
          + Create New Word
        </Button>
      </header>

      <div className="flex-none">
        <Input
          label=""
          placeholder="Search words by text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md shadow-sm"
        />
      </div>

      <div className="flex-1 overflow-hidden bg-card border border-border rounded-xl flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-medium">Word</th>
                <th className="p-4 font-medium hidden sm:table-cell">Language</th>
                <th className="p-4 font-medium hidden md:table-cell">Difficulty</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <>
                  <TableRowSkeleton columns={5} />
                  <TableRowSkeleton columns={5} />
                  <TableRowSkeleton columns={5} />
                  <TableRowSkeleton columns={5} />
                </>
              ) : words.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8">
                    <EmptyState
                      title="No words found"
                      description={searchTerm ? `No results match "${searchTerm}".` : 'Your dictionary is empty. Start by adding a new word.'}
                      actionLabel={searchTerm ? 'Clear Search' : 'Create Word'}
                      onAction={() => (searchTerm ? setSearchTerm('') : openCreateModal())}
                    />
                  </td>
                </tr>
              ) : (
                words.map((word) => (
                  <tr key={word.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 font-semibold text-foreground capitalize">{word.text}</td>
                    <td className="p-4 uppercase text-muted-foreground hidden sm:table-cell">{word.language}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center space-x-1">
                        <span>{Math.round(word.difficulty_score * 100)}%</span>
                        {word.is_sophisticated && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2">Sophisticated</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${word.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {word.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setManagingWord(word);
                          setIsSubEntityModalOpen(true);
                        }}
                        className="text-accent hover:bg-accent/10 rounded text-xs font-medium px-3 py-1.5 transition-colors"
                      >
                        Content
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWord(word);
                          setIsBaseModalOpen(true);
                        }}
                        className="text-primary hover:bg-primary/10 rounded text-xs font-medium px-3 py-1.5 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(word.id as string, word.text)}
                        className="text-red-500 hover:bg-red-500/10 rounded text-xs font-medium px-3 py-1.5 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WordFormModal
        isOpen={isBaseModalOpen}
        onClose={() => setIsBaseModalOpen(false)}
        onSubmit={handleBaseModalSubmit}
        initialData={editingWord}
      />

      <WordSubEntityManager
        isOpen={isSubEntityModalOpen}
        onClose={() => setIsSubEntityModalOpen(false)}
        word={managingWord}
        onWordUpdated={handleWordContentUpdated}
      />
    </div>
  );
};
