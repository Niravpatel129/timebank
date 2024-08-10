import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await newRequest.get('/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleLoginAndSetUser(response.data.user);
      } catch (error) {
        console.error('Auto-login failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const handleLoginAndSetUser = async (userData) => {
    if (!userData) return;

    try {
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', userData.token);
      Cookies.set('authToken', userData.token, { expires: 7 }); // Set cookie to expire in 7 days
      toast.success('Login successful');
    } catch (error) {
      toast.error('Sorry, we are unable to login you at this time. Please try again later.');
      console.error('Error logging in:', error);
    }
  };

  const checkVerificationStatus = async (email) => {
    try {
      const response = await newRequest.get(`/user/check-verification/${email}`);
      handleLoginAndSetUser(response.data.user);
      return response.data.isVerified;
    } catch (error) {
      toast.error('Error checking verification status');
      console.error('Error checking verification status:', error);
      return false;
    }
  };

  const handleAddVerificationCode = async ({ email, code }) => {
    try {
      const response = await newRequest.post('/user/add-verification-code', { email, code });
      if (response.data.user) {
        handleLoginAndSetUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      toast.error('Error adding verification code');
      console.error('Error adding verification code:', error);
      return null;
    }
  };

  const handleRegisterUser = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await newRequest.post('/user/send-verification', {
          name: data.userData.name,
          email: data.userData.email,
          onboardingData: data.onboardingData,
        });
        setUser(response.data.user);
        resolve(response.data);

        const checkInterval = setInterval(async () => {
          const isVerified = await checkVerificationStatus(data.userData.email);
          if (isVerified) {
            clearInterval(checkInterval);
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

  const logout = async () => {
    try {
      await newRequest.post('/user/logout');
      localStorage.removeItem('authToken');
      Cookies.remove('authToken');
      setUser(null);
      setIsLoggedIn(false);
      setOnboardingCompleted(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    logout,
    isLoggedIn,
    setIsLoggedIn,
    onboardingCompleted,
    setOnboardingCompleted,
    registerUser,
    handleRegisterUser,
    handleAddVerificationCode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
