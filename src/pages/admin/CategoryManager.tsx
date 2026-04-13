// src/pages/admin/CategoryManager.tsx

import React, { useEffect, useState } from 'react';
import { adminLexiconService } from '../../api/services/adminLexicon';
import { Category, CategoryPayload } from '../../types';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<CategoryPayload>({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await adminLexiconService.listCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCat = await adminLexiconService.createCategory(form);
      setCategories([newCat, ...categories]);
      setForm({ name: '', description: '' });
    } catch (error) {
      alert("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this category?")) {
      try {
        await adminLexiconService.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Category Manager</h1>
        <p className="text-sm text-muted-foreground">Organize your lexicon into thematic collections.</p>
      </header>

      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border mb-6">
        <h2 className="font-semibold mb-4 text-foreground">Add New Category</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="flex-[2] w-full">
            <Input label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">Create</Button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium hidden md:table-cell">Description</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className="hover:bg-muted/50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">{cat.description}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
