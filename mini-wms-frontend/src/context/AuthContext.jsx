import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, logout as apiLogout } from '../services/login';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = async () => {
        try{
            const data = await getUser();
            setUser(data?.user || null);
        }
        catch{
            setUser(null);
        }
        finally{
            setLoading(false);
        }
    }
    userData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUser();
      setUser(data?.user || null);
      return data?.user || null;
    } catch (err) {
      setUser(null);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { 
        await apiLogout(); } 
    catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}