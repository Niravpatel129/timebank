import React, { createContext, useContext, useState } from 'react';
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

  const handleLoginAndSetUser = async (userData) => {
    if (!userData) return;

    try {
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      toast.error('Sorry, we are unable to login you at this time. Please try again later.');
      console.error('Error logging in:', error);
    }
  };

  const checkVerificationStatus = async (email) => {
    try {
      const response = await newRequest.get(`/user/check-verification/${email}`);

      //   login the user
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
        // login the user
        handleLoginAndSetUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Error adding verification code:', error);
      return null;
    }
  };

  const handleRegisterUser = async (data) => {
    // step 1: send verification code
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
            toast.success('Verification successful');
            clearInterval(checkInterval);
            setIsLoggedIn(true);
            setOnboardingCompleted(true);
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
    handleAddVerificationCode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
