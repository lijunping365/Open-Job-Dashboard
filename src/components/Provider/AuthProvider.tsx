import { AuthContext } from '@/components/Provider/AuthContext';
import React, { useEffect, useState } from 'react';
import { currentUser } from '@/services/login';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const init = async () => {
      try {
        const user = await currentUser();
        if (user) setUser(user);
      } catch (error) {
        console.log(`获取用户信息失败:${error}`);
      }
    };
    init().then();
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
