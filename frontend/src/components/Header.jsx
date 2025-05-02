import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const HeaderContainer = styled.header`
  background-color: var(--color-dark);
  color: var(--color-light);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;

const Logo = styled(Link)`
  color: var(--color-light);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--color-light);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;

  &:hover {
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserInfo = styled.span`
  color: var(--color-light);
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid var(--color-secondary);
  color: var(--color-light);
  padding: 5px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;

   &:hover {
     background-color: var(--color-secondary);
     border-color: var(--color-secondary);
   }
`;

function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("Failed to logout: " + error.message);
    }
  };

  return (
    <HeaderContainer>
      <Logo to="/">Wishlist App</Logo>
      <Nav>
        {currentUser ? (
          <>
            <UserInfo>Welcome, {currentUser.email}</UserInfo>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
}

export default Header;