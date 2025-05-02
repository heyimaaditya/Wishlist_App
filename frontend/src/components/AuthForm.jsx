import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FormCard = styled.div`
  background: #fff;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Title = styled.h2`
  text-align: center;
  color: var(--color-dark);
  margin-bottom: var(--spacing-md);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Input = styled.input`
  padding: var(--spacing-sm);
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-danger);
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
`;

const StyledLink = styled(Link)`
  text-align: center;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

function AuthForm({ onSubmit, isSignup, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onSubmit(email, password);
  };

  return (
    <FormCard>
      <Title>{isSignup ? 'Sign Up' : 'Login'}</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isSignup && (
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <Button type="submit">{isSignup ? 'Sign Up' : 'Login'}</Button>
      </Form>
      {isSignup ? (
        <StyledLink to="/login">Already have an account? Login</StyledLink>
      ) : (
        <StyledLink to="/signup">Need an account? Sign Up</StyledLink>
      )}
    </FormCard>
  );
}

export default AuthForm;