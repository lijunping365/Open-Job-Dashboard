import { AuthContext } from '@/components/Provider/AuthContext';
import React, { useEffect, useState } from 'react';
import { currentUser } from '@/services/api';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<any>();

  const initUser = async () => {
    try {
      const user = await currentUser();
      if (user) setUser(user);
    } catch (error) {
      console.log('error:' + error);
    }
  };

  useEffect(() => {
    initUser().then();
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
