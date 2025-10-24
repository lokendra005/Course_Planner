import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const LoginButton: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (user) {
    return (
      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">
          Sign Out
        </button>
      </div>
    );
  }

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="auth-buttons">
        <button onClick={handleLoginClick} className="login-btn">
          Sign In
        </button>
        <button onClick={handleSignupClick} className="signup-btn">
          Sign Up
        </button>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default LoginButton;
