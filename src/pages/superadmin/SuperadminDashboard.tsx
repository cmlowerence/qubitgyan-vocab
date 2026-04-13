// src/pages/superadmin/SuperadminDashboard.tsx

import React, { useEffect, useState } from 'react';
import { superadminService, SystemHealth } from '../../api/services/superadmin';

export const SuperadminDashboard = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await superadminService.getSystemHealth();
      setHealth(data);
    } catch (err) {
      setError('Failed to reach the health endpoint. The system might be offline or degraded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
        <p className="text-muted-foreground mt-1">Global monitoring and executive analytics.</p>
      </header>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">API Health Status</h2>
          <button onClick={fetchHealth} className="text-sm font-medium text-primary hover:underline">
            Refresh Status
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span className="font-semibold capitalize">{health?.status || 'Active'}</span>
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Version</span>
              <p className="mt-1 font-semibold text-foreground">{health?.version || 'v1.0.0'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Database</span>
              <p className="mt-1 font-semibold text-foreground capitalize">{health?.database || 'Connected'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Uptime</span>
              <p className="mt-1 font-semibold text-foreground">
                {health?.uptime_seconds ? `${Math.floor(health.uptime_seconds / 3600)}h ${Math.floor((health.uptime_seconds % 3600) / 60)}m` : 'System Online'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold mb-2">Access Control Node</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage staff, superusers, and handle student suspensions.</p>
          <a href="/superadmin/users" className="inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            Manage Users
          </a>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border opacity-50 cursor-not-allowed">
          <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
          <p className="text-sm text-muted-foreground mb-4">System action tracking and history. (Pending Backend Support)</p>
          <button disabled className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};
