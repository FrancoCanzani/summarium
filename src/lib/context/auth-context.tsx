'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  email: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id || null,
        email: user?.email || null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
