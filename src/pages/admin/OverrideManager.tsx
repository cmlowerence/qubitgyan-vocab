// src/pages/admin/OverrideManager.tsx

import React, { useState } from 'react';
import { adminLexiconService } from '../../api/services/adminLexicon';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const OverrideManager = () => {
  const [wotdDate, setWotdDate] = useState('');
  const [wotdWordId, setWotdWordId] = useState('');
  const [isWotdSubmitting, setIsWotdSubmitting] = useState(false);

  const [practiceDate, setPracticeDate] = useState('');
  const [practiceIds, setPracticeIds] = useState('');
  const [isPracticeSubmitting, setIsPracticeSubmitting] = useState(false);

  const handleWotdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWotdSubmitting(true);
    try {
      await adminLexiconService.overrideWotd({ date: wotdDate, word: wotdWordId });
      alert("Word of the Day overridden successfully.");
      setWotdDate('');
      setWotdWordId('');
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.detail || 'Invalid data'}`);
    } finally {
      setIsWotdSubmitting(false);
    }
  };

  const handlePracticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPracticeSubmitting(true);
    try {
      const wordsArray = practiceIds.split(',').map(id => id.trim()).filter(id => id);
      if (wordsArray.length < 15 || wordsArray.length > 20) {
        alert("Please provide exactly 15 to 20 UUIDs.");
        setIsPracticeSubmitting(false);
        return;
      }
      await adminLexiconService.overridePractice({ date: practiceDate, words: wordsArray });
      alert("Daily Practice overridden successfully.");
      setPracticeDate('');
      setPracticeIds('');
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.detail || 'Invalid data'}`);
    } finally {
      setIsPracticeSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Content Overrides</h1>
        <p className="text-sm text-muted-foreground">Manually inject specific daily content into the system.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-2">Override Word of the Day</h2>
          <p className="text-xs text-muted-foreground mb-4">Forces a specific word to appear on a specific date.</p>
          <form onSubmit={handleWotdSubmit} className="space-y-4">
            <Input label="Target Date (YYYY-MM-DD)" type="date" value={wotdDate} onChange={e => setWotdDate(e.target.value)} required />
            <Input label="Word UUID" placeholder="e.g., 1b9441d3-..." value={wotdWordId} onChange={e => setWotdWordId(e.target.value)} required />
            <Button type="submit" isLoading={isWotdSubmitting}>Apply WOTD Override</Button>
          </form>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-2">Override Daily Practice</h2>
          <p className="text-xs text-muted-foreground mb-4">Provide 15-20 comma-separated Word UUIDs.</p>
          <form onSubmit={handlePracticeSubmit} className="space-y-4">
            <Input label="Target Date (YYYY-MM-DD)" type="date" value={practiceDate} onChange={e => setPracticeDate(e.target.value)} required />
            <div className="flex flex-col w-full space-y-1.5">
              <label className="text-sm font-medium text-foreground">Word UUIDs (Comma separated)</label>
              <textarea 
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-24 resize-none"
                value={practiceIds}
                onChange={e => setPracticeIds(e.target.value)}
                required
                placeholder="uuid-1, uuid-2, uuid-3..."
              />
            </div>
            <Button type="submit" isLoading={isPracticeSubmitting}>Apply Practice Override</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
