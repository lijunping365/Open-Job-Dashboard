import React, { useContext } from 'react';
import { User } from '@/types/typings';

export interface AuthContextValue {
  user: User | null;
  setUser?: any;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
});

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return { ...authContext, isLogin: !!authContext.user };
};
