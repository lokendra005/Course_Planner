import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>
        
        {mode === 'login' ? (
          <LoginForm 
            onSwitchToSignup={() => setMode('signup')} 
            onClose={onClose}
          />
        ) : (
          <SignupForm 
            onSwitchToLogin={() => setMode('login')} 
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
