import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Auth provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);              // user object { email, role, etc }
  const [isLoggedIn, setIsLoggedIn] = useState(false); // true when logged in
  const [isLoading, setIsLoading] = useState(true);    // prevents premature route checks

  useEffect(() => {
    // Simulated session restoration (replace with your real logic)
    const session = JSON.parse(localStorage.getItem("session")); // or token, or backend call

    if (session?.user) {
      setUser(session.user);
      setIsLoggedIn(true);
    }

    setIsLoading(false); // auth check complete
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("session", JSON.stringify({ user: userData }));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the auth context
export const useAuth = () => useContext(AuthContext);
