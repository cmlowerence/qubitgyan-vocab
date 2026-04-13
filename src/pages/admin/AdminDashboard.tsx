// src/pages/admin/AdminDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Control Center</h1>
        <p className="text-muted-foreground mt-1">Overview of the lexicon system and quick actions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Word Management" 
          desc="Add, edit, and curate words, meanings, and pronunciations."
          link="/admin/words"
        />
        <DashboardCard 
          title="Categories" 
          desc="Organize words into thematic sets and difficulty tiers."
          link="/admin/categories"
        />
        <DashboardCard 
          title="Content Overrides" 
          desc="Manually set the Word of the Day and Daily Practice."
          link="/admin/overrides"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, desc, link }: { title: string, desc: string, link: string }) => (
  <Link to={link} className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group">
    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2">{desc}</p>
  </Link>
);
