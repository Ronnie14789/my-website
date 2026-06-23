import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authApi } from '../api/endpoints';

interface AdminUser {
  email: string;
  role: string;
}

interface AuthContextValue {
  token: string | null;
  user: AdminUser | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = 'token';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsReady(true);
      return;
    }

    authApi
      .getSession()
      .then((response) => {
        setUser(response.data.data as AdminUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsReady(true));
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const authToken = response.data.data?.token;
    const authUser = response.data.data?.user as AdminUser | undefined;

    if (!authToken || !authUser) {
      throw new Error('Authentication failed.');
    }

    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isReady, login, logout }),
    [token, user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
