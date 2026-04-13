// src/pages/student/Dashboard.tsx (Updated)

import React, { useEffect, useState } from 'react';
import { lexiconService } from '../../api/services/lexicon';
import { WordObject } from '../../types';
import { WordCard } from '../../components/lexicon/WordCard';
import { Button } from '../../components/common/Button';
import { WordCardSkeleton, Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { WordDetailDrawer } from '../../components/lexicon/WordDetailDrawer';
import { useToast } from '../../hooks/useToast';

export const Dashboard = () => {
  const [wotd, setWotd] = useState<WordObject | null>(null);
  const [practiceWords, setPracticeWords] = useState<WordObject[]>([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // New State for Detail Drawer
  const [selectedWord, setSelectedWord] = useState<WordObject | null>(null);
  
  const { addToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setIsPreparing(false);
    try {
      const [wotdRes, practiceRes] = await Promise.all([
        lexiconService.getWordOfTheDay(),
        lexiconService.getDailyPractice()
      ]);

      if ('status' in wotdRes && wotdRes.status === 'preparing') {
        setIsPreparing(true);
      } else {
        setWotd((wotdRes as any).word);
      }

      if ('status' in practiceRes && practiceRes.status === 'preparing') {
        setIsPreparing(true);
      } else {
        setPracticeWords((practiceRes as any).words || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      addToast('Failed to sync today\'s lexicon journey. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        <header className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <WordCardSkeleton />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WordCardSkeleton />
            <WordCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isPreparing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-foreground mb-2">Curating Your Lexicon</h2>
        <p className="text-muted-foreground mb-6 max-w-md">Your personalized daily content is currently being prepared by the AI engine. Check back shortly.</p>
        <Button onClick={fetchData} variant="outline" className="w-auto">Refresh Status</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10 pb-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Here is your linguistic journey for today.</p>
        </header>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Word of the Day</h2>
          {wotd ? (
            <WordCard word={wotd} label="Daily Focus" onClick={() => setSelectedWord(wotd)} />
          ) : (
            <EmptyState 
              title="No Word of the Day" 
              description="The daily word hasn't been published yet. Please check back later." 
            />
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Daily Practice</h2>
          {practiceWords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practiceWords.map(word => (
                <WordCard key={word.id} word={word} onClick={() => setSelectedWord(word)} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Practice Set Empty" 
              description="Your daily practice words are currently unavailable." 
            />
          )}
        </section>
      </div>

      {/* Global Drawer Component */}
      <WordDetailDrawer 
        isOpen={!!selectedWord} 
        word={selectedWord} 
        onClose={() => setSelectedWord(null)} 
      />
    </>
  );
};
