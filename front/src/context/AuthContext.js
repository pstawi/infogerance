import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi, getProfile } from "../Services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (localStorage.getItem("auth_token")) {
          const me = await getProfile();
          setUser(me);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const login = async (email, password) => {
    await loginApi(email, password);
    const me = await getProfile();
    setUser(me);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 