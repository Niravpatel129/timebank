import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Simulate checking user status
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error('Error checking user status:', error);
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setOnboardingCompleted(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setOnboardingCompleted(false);
  };

  const value = {
    user,
    loading,
    updateUser,
    logout,
    isLoggedIn,
    setIsLoggedIn,
    onboardingCompleted,
    setOnboardingCompleted,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
