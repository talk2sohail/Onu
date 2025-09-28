import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

// Define the shape of the context data
interface AuthContextData {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextData>({
  token: null,
  login: () => {},
  logout: () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);

  // In a real app, you'd also handle storing the token securely
  // in AsyncStorage for persistence.

  const login = (newToken: string) => {
    // Here you could add validation logic for the token
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
