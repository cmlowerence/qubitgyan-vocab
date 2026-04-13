// src/pages/superadmin/UserManager.tsx

import React, { useEffect, useState } from 'react';
import { superadminService } from '../../api/services/superadmin';
import { User } from '../../types';
import { Input } from '../../components/common/Input';

export const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Expecting a fallback to an empty array if the backend endpoint isn't fully implemented yet
      const data = await superadminService.listUsers().catch(() => []);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAccess = async (user: User, field: 'is_staff' | 'is_superuser' | 'is_suspended') => {
    const originalValue = user[field];
    
    // Optimistic UI update
    setUsers(users.map(u => u.id === user.id ? { ...u, [field]: !originalValue } : u));
    
    try {
      await superadminService.updateUserAccess(user.id, { [field]: !originalValue });
    } catch (error) {
      alert("Failed to update user access.");
      // Revert on failure
      setUsers(users.map(u => u.id === user.id ? { ...u, [field]: originalValue } : u));
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <header>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">Elevate privileges and manage account statuses.</p>
      </header>

      <div className="flex-none max-w-md">
        <Input 
          label="" 
          placeholder="Search by name or email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="flex-1 overflow-hidden bg-card border border-border rounded-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-center">Staff Access</th>
                <th className="p-4 font-medium text-center">Superuser</th>
                <th className="p-4 font-medium text-center">Suspended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found or API unavailable.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                        ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={user.is_staff} 
                        onChange={() => handleToggleAccess(user, 'is_staff')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                        disabled={user.is_superuser} // Superusers are inherently staff
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={user.is_superuser} 
                        onChange={() => handleToggleAccess(user, 'is_superuser')}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={user.is_suspended} 
                        onChange={() => handleToggleAccess(user, 'is_suspended')}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
