'use client';

import { Author } from '@rizu/shared';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: Author | null,
  setUser: (user: Author | null) => void,
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ user, setUser ] = useState<Author | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include'
        });

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error('useAuth is missing AuthProvider');
  }

  return context;
}