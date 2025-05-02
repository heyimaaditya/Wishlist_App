import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AuthForm from '../components/AuthForm';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: var(--color-light);
  padding: var(--spacing-md);
`;

function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <AuthContainer>
       <AuthForm onSubmit={handleLogin} isSignup={false} error={error} />
    </AuthContainer>
  );
}

export default LoginPage;