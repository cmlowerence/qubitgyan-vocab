// src/components/lexicon/WordCard.tsx

import React from 'react';
import { WordObject } from '../../types';

interface WordCardProps {
  word: WordObject;
  label?: string;
  onClick?: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, label, onClick }) => {
  const primaryMeaning = word.meanings?.[0];

  return (
    <div 
      onClick={onClick}
      className={`bg-card p-5 rounded-xl border border-border shadow-sm transition-all ${onClick ? 'cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]' : ''}`}
    >
      {label && <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2 block">{label}</span>}
      <div className="flex items-baseline space-x-3 mb-3">
        <h3 className="text-2xl font-bold text-foreground capitalize">{word.text}</h3>
        {word.phonetic_text && (
          <span className="text-sm text-muted-foreground font-mono">{word.phonetic_text}</span>
        )}
      </div>
      
      {primaryMeaning ? (
        <div>
          <span className="text-xs font-medium text-muted-foreground italic mb-1 block">
            {primaryMeaning.part_of_speech}
          </span>
          <p className="text-sm text-foreground line-clamp-2">
            {primaryMeaning.definition}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">Definition unavailable.</p>
      )}
      
      <div className="mt-4 flex gap-2">
        {word.is_sophisticated && (
          <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded">Sophisticated</span>
        )}
        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-semibold rounded">
          Difficulty: {Math.round(word.difficulty_score * 100)}%
        </span>
      </div>
    </div>
  );
};
