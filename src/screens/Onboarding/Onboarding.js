import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';

const Onboarding = () => {
  const [selectedTools, setSelectedTools] = useState([]);
  const [step, setStep] = useState(1);
  const [usageType, setUsageType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const categories = [
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '🏋️' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '🎉' },
  ];

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

  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulating email sending process
    setTimeout(() => {
      alert('Check your email for the login link!');
      setIsLoggingIn(false);
    }, 2000);
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
        What's your name and email?
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
          onClick={handleContinue}
        >
          Continue
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
        We've sent a verification code to your email. Please enter it below to login:
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
        <input
          type='text'
          placeholder='Verification Code'
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
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
          onClick={handleContinue}
        >
          Verify
        </motion.button>
      </div>
    </>
  );

  const renderLoginStep = () => (
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
              Check your email
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
      {step === 1
        ? renderStep1()
        : step === 2
        ? renderStep2()
        : step === 3
        ? renderStep3()
        : renderStep4()}

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
        onClick={() => setStep(step === 4 ? 1 : 4)}
      >
        <motion.span
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 4 ? 'Back to onboarding' : 'Already have an account?'}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Onboarding;
