import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Profile = () => {
  const auth = useContext(AuthContext);

  const user = auth?.user;

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account summary and access level.</p>
      </header>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'Guest'}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email || 'No account loaded'}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
            {user?.role || 'unknown'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <div className="rounded-lg border border-border p-4 bg-background">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Username</p>
            <p className="mt-2 text-sm font-medium text-foreground">{user?.username || '-'}</p>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Account Status</p>
            <p className="mt-2 text-sm font-medium text-foreground">{user?.is_suspended ? 'Suspended' : 'Active'}</p>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Staff Access</p>
            <p className="mt-2 text-sm font-medium text-foreground">{user?.is_staff ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Superuser</p>
            <p className="mt-2 text-sm font-medium text-foreground">{user?.is_superuser ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end">
          <Button
            variant="outline"
            className="w-auto"
            onClick={() => {
              auth?.logout();
              window.location.href = '/login';
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
