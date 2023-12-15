import React, { useContext } from 'react';

export interface AuthContextValue {
  user: API.User | null;
  setUser?: any;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
});

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return { ...authContext, isLogin: !!authContext.user };
};
