import React, { useContext } from 'react';
import { User } from '@/types/UserTyping';

export interface AuthContextValue {
  user: User | null;
  setUser?: any;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
});

const isAdminFn = (authContext: AuthContextValue) => {
  if (!authContext.user) {
    return false;
  }
  return !!authContext.user.admin;
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  const isAdmin = isAdminFn(authContext);
  return { isAdmin, ...authContext, isLogin: !!authContext.user };
};
