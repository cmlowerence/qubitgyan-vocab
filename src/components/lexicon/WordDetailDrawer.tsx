// src/components/lexicon/WordDetailDrawer.tsx

import React, { useEffect } from 'react';
import { WordObject } from '../../types';

interface WordDetailDrawerProps {
  word: WordObject | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordDetailDrawer: React.FC<WordDetailDrawerProps> = ({ word, isOpen, onClose }) => {
  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !word) return null;

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Audio playback failed", e));
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full md:w-[450px] h-[90vh] md:h-full mt-[10vh] md:mt-0 bg-card md:border-l border-t md:border-t-0 border-border shadow-2xl flex flex-col rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom-full md:slide-in-from-right-full duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10 md:rounded-none rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-foreground capitalize">{word.text}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-muted-foreground font-mono">{word.phonetic_text}</span>
              {word.pronunciations?.map((pron) => (
                <button 
                  key={pron.id} 
                  onClick={() => playAudio(pron.audio_url)}
                  className="p-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  title={`Play ${pron.region} pronunciation`}
                >
                  <svg className="w-4 h-4 pl-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-border transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md uppercase tracking-wider">
              {word.language}
            </span>
            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md uppercase tracking-wider">
              Diff: {Math.round(word.difficulty_score * 100)}%
            </span>
            {word.is_sophisticated && (
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">
                Sophisticated
              </span>
            )}
          </div>

          {/* Meanings */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Definitions</h3>
            {word.meanings?.length > 0 ? (
              <ul className="space-y-5">
                {word.meanings.map((meaning, idx) => (
                  <li key={meaning.id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-accent italic">{meaning.part_of_speech}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 rounded">{idx + 1}</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{meaning.definition}</p>
                    {meaning.example && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mt-2">
                        "{meaning.example}"
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No definitions available.</p>
            )}
          </div>

          {/* Thesaurus Links */}
          {word.thesaurus_entries?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Related Words</h3>
              <div className="flex flex-wrap gap-2">
                {word.thesaurus_entries.map((entry) => (
                  <span 
                    key={entry.id} 
                    className={`px-3 py-1.5 text-sm rounded-full border ${
                      entry.relation_type === 'SYN' ? 'bg-green-500/10 border-green-500/20 text-green-700' :
                      entry.relation_type === 'ANT' ? 'bg-red-500/10 border-red-500/20 text-red-700' :
                      'bg-muted border-border text-foreground'
                    }`}
                  >
                    {entry.related_word_text} <span className="text-[10px] uppercase ml-1 opacity-60">{entry.relation_type}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
