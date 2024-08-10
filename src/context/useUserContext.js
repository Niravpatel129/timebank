import React, { createContext, useContext, useEffect, useState } from 'react';
import newRequest from '../api/newReqest';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [registerUser, setRegisterUser] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await newRequest.get('/user/status');
        if (response.data.isLoggedIn) {
          setUser(response.data.user);
          setIsLoggedIn(true);
          setOnboardingCompleted(response.data.onboardingCompleted);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking user status:', error);
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const checkVerificationStatus = async (email) => {
    try {
      const response = await newRequest.post('/user/is-verified', { email });
      return response.data.isVerified;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  };

  const handleRegisterUser = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await newRequest.post('/user/send-verification', data);
        setUser(response.data.user);

        const checkInterval = setInterval(async () => {
          const isVerified = await checkVerificationStatus(data.email);
          if (isVerified) {
            clearInterval(checkInterval);
            setIsLoggedIn(true);
            setOnboardingCompleted(true);
            resolve(response.data);
          }
        }, 4000);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Verification timeout'));
        }, 600000);
      } catch (error) {
        console.error('Error registering user:', error);
        reject(error);
      }
    });
  };

  const updateUser = async (userData) => {
    try {
      const response = await newRequest.put('/user/update', userData);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const logout = async () => {
    try {
      await newRequest.post('/user/logout');
      setUser(null);
      setIsLoggedIn(false);
      setOnboardingCompleted(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
    registerUser,
    handleRegisterUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
