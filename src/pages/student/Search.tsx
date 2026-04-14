import React, { useEffect, useRef, useState } from 'react';
import { lexiconService } from '../../api/services/lexicon';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchResponse, WordObject } from '../../types';
import { WordCard } from '../../components/lexicon/WordCard';
import { WordDetailDrawer } from '../../components/lexicon/WordDetailDrawer';

export const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trending, setTrending] = useState<WordObject[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordObject | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    lexiconService.getTrending()
      .then(data => {
        if (isMounted) {
          setTrending(data);
        }
      })
      .catch(err => console.error('Failed to load trending words', err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      requestIdRef.current += 1;
      setResults(null);
      setIsLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    const performSearch = async () => {
      setIsLoading(true);

      try {
        const data = await lexiconService.search(trimmedQuery);
        if (requestId !== requestIdRef.current) return;
        setResults(data);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setResults({ error: 'Failed to perform search. Please try again.' });
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-pulse">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium">Searching the lexicon...</p>
        </div>
      );
    }

    if (!results) return null;

    if ('error' in results) {
      return (
        <div className="py-12 text-center animate-in fade-in duration-300">
          <p className="text-red-500 font-medium mb-4">{results.error}</p>
          {results.suggestions && results.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-md mx-auto">
              <span className="text-sm text-muted-foreground w-full mb-2">Did you mean:</span>
              {results.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-full text-sm hover:bg-secondary/80 transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if ('mode' in results && results.mode === 'semantic') {
      return (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md">Semantic Matches</span>
            <span className="text-sm text-muted-foreground">for "{results.query}"</span>
          </div>
          {results.results.map((word) => (
            <WordCard key={word.id} word={word} onClick={() => setSelectedWord(word)} />
          ))}
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-300">
        <WordCard word={results as WordObject} label="Exact Match" onClick={() => setSelectedWord(results as WordObject)} />
      </div>
    );
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col">
        <div className="sticky top-0 bg-background pt-4 pb-2 z-10">
          <h1 className="text-2xl font-bold text-foreground mb-4">Lexicon Search</h1>
          <div className="relative shadow-sm group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-12 py-4 border border-border rounded-xl leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
              placeholder="Search for a word, meaning, or concept..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          {!query && !results && (
            <div className="animate-in fade-in duration-500 space-y-8 mt-4">
              {trending.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Trending Now
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((word) => (
                      <button
                        key={word.id}
                        onClick={() => setSelectedWord(word)}
                        className="px-4 py-2 bg-card border border-border hover:border-primary/50 rounded-full text-sm font-medium transition-colors"
                      >
                        {word.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center pt-12 text-center px-4">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-foreground">Explore the Lexicon</p>
                <p className="text-sm mt-2 max-w-sm mx-auto text-muted-foreground leading-relaxed">
                  Try searching for a specific word or a broad concept.
                </p>
              </div>
            </div>
          )}
          {renderResults()}
        </div>
      </div>

      <WordDetailDrawer isOpen={!!selectedWord} word={selectedWord} onClose={() => setSelectedWord(null)} />
    </>
  );
};
