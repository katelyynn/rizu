'use client';

import { Author, GeneralSettings } from '@rizu/shared';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';

const defaultGeneral: GeneralSettings = {
  language: 'en-GB',
  region: 'system',
  theme: 'light',
  layout: 'classic'
}

interface AuthContextType {
  user: Author | null,
  setUser: (user: Author | null) => void,
  loading: boolean,
  general: GeneralSettings,
  setGeneral: (settings: GeneralSettings) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ user, setUser ] = useState<Author | null>(null);
  const [ loading, setLoading ] = useState(true);

  const [ general, setGeneral ] = useState<GeneralSettings>(defaultGeneral);

  const applyClasses = (theme: string, layout: string) => {
    if (typeof document == 'undefined') return;

    const body = document.body;

    body.setAttribute('data-theme', theme);
    body.setAttribute('data-layout', layout);
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include'
        });

        const data = await res.json();
        setUser(data.user);

        if (data.user) {
          const theme = Cookies.get('rizuTheme') || defaultGeneral.theme;
          const layout = Cookies.get('rizuLayout') || defaultGeneral.layout;

          const newSettings: GeneralSettings = {
            language: Cookies.get('rizuLanguage') || defaultGeneral.language,
            region: Cookies.get('rizuRegion') || defaultGeneral.region,
            theme,
            layout
          };

          setGeneral(newSettings);
          applyClasses(theme, layout);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    applyClasses(general.theme, general.layout);
  }, [ general ]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, general, setGeneral }}>
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