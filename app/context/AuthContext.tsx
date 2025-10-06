import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";

// Define the shape of the context data
interface AuthContextData {
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  handleUnauthorized: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextData>({
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  handleUnauthorized: () => {},
});

const TOKEN_KEY = "github_token";

// Create the provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load token from secure store", e);
      } finally {
        setLoading(false);
      }
    }

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch (e) {
      console.error("Failed to save token to secure store", e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
    } catch (e) {
      console.error("Failed to delete token from secure store", e);
    }
  };

  const handleUnauthorized = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{ token, loading, login, logout, handleUnauthorized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
