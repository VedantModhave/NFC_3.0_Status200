import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase'; // Import Firebase auth

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? { ...user, isAdmin: user.email === 'admin@example.com' } : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
