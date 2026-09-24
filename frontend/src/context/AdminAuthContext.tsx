import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export interface AdminAccount {
  _id: string;
  fullname?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role_id?: {
    _id: string;
    title?: string;
    permissions: string[];
  };
  status: string;
}

interface AdminAuthContextType {
  account: AdminAccount | null;
  permissions: string[];
  loading: boolean;
  hasPermission: (perm: string) => boolean;
  refreshAccount: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAccount = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/auth/me', { withCredentials: true });
      if (res.data.code === 200) {
        setAccount(res.data.data);
      } else {
        setAccount(null);
      }
    } catch {
      setAccount(null);
    }
  }, []);

  useEffect(() => {
    refreshAccount().finally(() => setLoading(false));
  }, [refreshAccount]);

  const permissions: string[] = account?.role_id?.permissions || [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  return (
    <AdminAuthContext.Provider value={{ account, permissions, loading, hasPermission, refreshAccount }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
