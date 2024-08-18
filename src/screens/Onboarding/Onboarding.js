import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { useUserContext } from '../../context/useUserContext';

const Onboarding = () => {
  const {
    handleRegisterUser,
    handleAddVerificationCode,
    handleLoginUser,
    handleLoginVerificationCode,
  } = useUserContext();
  const [selectedTools, setSelectedTools] = useState([]);
  const [step, setStep] = useState(1);
  const [usageType, setUsageType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const codeInputRefs = [useRef(), useRef(), useRef(), useRef()];
  const loginCodeInputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [loginVerificationCode, setLoginVerificationCode] = useState(['', '', '', '']);
  const [isLoginVerifying, setIsLoginVerifying] = useState(false);

  const categories = [
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '🏋️' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '🎉' },
  ];

  const handleLoginVerify = async () => {
    if (isLoginVerifying) return;
    setIsLoginVerifying(true);
    try {
      await handleLoginVerificationCode({ email, code: loginVerificationCode.join('') });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoginVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      await handleAddVerificationCode({
        email,
        code: verificationCode.join(''),
      });
    } catch (error) {
      console.error('Verification failed:', error);
      // Handle verification error (e.g., show error message)
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegister = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
    try {
      await handleRegisterUser({
        onboardingData: {
          usageType,
          selectedTools,
        },
        userData: {
          name,
          email,
        },
      });

      setStep(4);
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Error registering user:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleToolSelect = (toolId) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId],
    );
  };

  const handleContinue = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleUsageTypeSelect = (type) => {
    setUsageType(type);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await handleLoginUser({ email });
      toast.success('Check your email for the verification code!');
      setStep(6); // Move to verification step
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const newVerificationCode = [...verificationCode];

    if (value.length === 4) {
      // Handle pasting of 4 digits
      for (let i = 0; i < 4; i++) {
        newVerificationCode[i] = value[i];
      }
      setVerificationCode(newVerificationCode);
      codeInputRefs[3].current.focus();
    } else if (value.length <= 1) {
      // Handle single digit input and backspace
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      if (value.length === 1 && index < 3) {
        codeInputRefs[index + 1].current.focus();
      } else if (value.length === 0 && index > 0) {
        codeInputRefs[index - 1].current.focus();
      }
    }
  };

  const handleLoginVerificationCodeChange = (index, value) => {
    const newLoginVerificationCode = [...loginVerificationCode];

    if (value.length === 4) {
      // Handle pasting of 4 digits
      for (let i = 0; i < 4; i++) {
        newLoginVerificationCode[i] = value[i];
      }
      setLoginVerificationCode(newLoginVerificationCode);
      loginCodeInputRefs[3].current.focus();
    } else if (value.length <= 1) {
      // Handle single digit input and backspace
      newLoginVerificationCode[index] = value;
      if (value.length === 1 && index < 3) {
        loginCodeInputRefs[index + 1].current.focus();
      } else if (value.length === 0 && index > 0) {
        loginCodeInputRefs[index - 1].current.focus();
      }
    }
    setLoginVerificationCode(newLoginVerificationCode);
  };

  const renderStep1 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Tell us more about you
      </h1>
      <p
        style={{
          marginBottom: '30px',
          color: '#555',
          fontSize: '1.2rem',
          maxWidth: '600px',
          textAlign: 'center',
          lineHeight: '1.6',
        }}
      >
        What areas are you most interested in improving? Select all that apply:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          maxWidth: '800px',
        }}
      >
        {categories.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '40px 70px',
              border: `2px solid ${selectedTools.includes(tool.id) ? '#4a4cff' : '#e0e0e0'}`,
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9ff)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onClick={() => handleToolSelect(tool.id)}
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                border: `2px solid ${selectedTools.includes(tool.id) ? '#4a4cff' : '#e0e0e0'}`,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedTools.includes(tool.id) ? '#4a4cff' : 'transparent',
              }}
            >
              {selectedTools.includes(tool.id) && (
                <FaCheck style={{ color: '#fff', fontSize: '12px' }} />
              )}
            </div>
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>{tool.icon}</span>
            <span
              style={{
                fontSize: '20px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#333',
              }}
            >
              {tool.name}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '50px',
          padding: '15px 40px',
          background: 'linear-gradient(45deg, #333, #333)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600',
          boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
          transition: 'all 0.3s ease',
        }}
        onClick={handleContinue}
      >
        Continue
      </motion.button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        How do you plan to use this task list?
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          maxWidth: '800px',
        }}
      >
        {[
          { type: 'Solo task list', icon: '👤' },
          { type: 'Team task list', icon: '👥' },
          { type: 'Not sure yet', icon: '🤔' },
        ].map(({ type, icon }) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '40px 70px',
              border: `2px solid ${usageType === type ? '#4a4cff' : '#e0e0e0'}`,
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9ff)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onClick={() => handleUsageTypeSelect(type)}
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                border: `2px solid ${usageType === type ? '#4a4cff' : '#e0e0e0'}`,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: usageType === type ? '#4a4cff' : 'transparent',
              }}
            >
              {usageType === type && <FaCheck style={{ color: '#fff', fontSize: '12px' }} />}
            </div>
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</span>
            <span
              style={{
                fontSize: '20px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#333',
              }}
            >
              {type}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '50px',
          padding: '15px 40px',
          background: 'linear-gradient(45deg, #333, #333)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600',
          boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
          transition: 'all 0.3s ease',
        }}
        onClick={handleContinue}
      >
        Continue
      </motion.button>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Finally, what should we call you?
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <input
          type='text'
          placeholder='Your Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '15px',
            fontSize: '18px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
          }}
        />
        <input
          type='email'
          placeholder='Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '15px',
            fontSize: '18px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            background: 'linear-gradient(45deg, #333, #333)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ marginRight: '10px' }}
              >
                <FaSpinner />
              </motion.div>
              Registering...
            </motion.div>
          ) : (
            'Continue'
          )}
        </motion.button>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Verify Your Email
      </h1>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
        We've sent a verification code to your email. Please enter it below to complete the
        onboarding process:
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength={4}
              value={digit}
              onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
              ref={codeInputRefs[index]}
              style={{
                width: '60px',
                height: '60px',
                fontSize: '24px',
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                outline: 'none',
              }}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            background: 'linear-gradient(45deg, #4a47ff, #3230a6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ marginRight: '10px' }}
              >
                <FaSpinner />
              </motion.div>
              Verifying...
            </motion.div>
          ) : (
            'Verify'
          )}
        </motion.button>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        Didn't receive the code?{' '}
        <span style={{ color: '#4a47ff', cursor: 'pointer' }} onClick={() => handleRegister()}>
          Resend code
        </span>
      </p>
    </>
  );

  const renderStep6 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Verify Login
      </h1>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
        We've sent a verification code to your email. Please enter it below to complete the login
        process:
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {loginVerificationCode.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength={4}
              value={digit}
              onChange={(e) => handleLoginVerificationCodeChange(index, e.target.value)}
              ref={loginCodeInputRefs[index]}
              style={{
                width: '60px',
                height: '60px',
                fontSize: '24px',
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                outline: 'none',
              }}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            background: 'linear-gradient(45deg, #4a47ff, #3230a6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleLoginVerify}
          disabled={isLoginVerifying}
        >
          {isLoginVerifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ marginRight: '10px' }}
              >
                <FaSpinner />
              </motion.div>
              Verifying...
            </motion.div>
          ) : (
            'Verify'
          )}
        </motion.button>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        Didn't receive the code?{' '}
        <span
          style={{ color: '#4a47ff', cursor: 'pointer' }}
          onClick={() => handleLoginUser({ email: email })}
        >
          Resend code
        </span>
      </p>
    </>
  );

  const renderStep5 = () => (
    <>
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Login to Your Account
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <input
          type='email'
          placeholder='Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '15px',
            fontSize: '18px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            background: 'linear-gradient(45deg, #333, #333)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <FaSpinner style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </motion.button>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {(() => {
        switch (step) {
          case 1:
            return renderStep1();
          case 2:
            return renderStep2();
          case 3:
            return renderStep3();
          case 4:
            return renderStep4();
          case 5:
            return renderStep5();
          case 6:
            return renderStep6();
          default:
            return renderStep1();
        }
      })()}

      <motion.div
        whileHover={{
          opacity: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.5,
          fontSize: '13px',
          cursor: 'pointer',
        }}
        onClick={() => setStep(step === 5 ? 1 : 5)}
      >
        <motion.span
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 5 || step === 6 ? 'Back to onboarding' : 'Already have an account?'}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Onboarding;
