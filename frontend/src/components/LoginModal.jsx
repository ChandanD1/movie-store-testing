import React, { useState, useEffect, useRef } from 'react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      dialog.showModal();

      const handleBackdropClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      };

      dialog.addEventListener('click', handleBackdropClick);

      const handleClose = () => {
        onClose();
      };
      dialog.addEventListener('close', handleClose);

      return () => {
        dialog.removeEventListener('click', handleBackdropClick);
        dialog.removeEventListener('close', handleClose);
        dialog.close();
      };
    } else {
      dialog.close();
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data);
        dialogRef.current.close();
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Connection to backend failed. Make sure server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} closedby="any" aria-labelledby="login-dialog-title" id="login-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="login-dialog-title">Login</h2>
          <button className="modal-close-btn" onClick={() => dialogRef.current.close()} id="close-login-modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error" id="login-error-msg">{error}</div>}

          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              className="form-control"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input 
              type="password" 
              id="login-password" 
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
            <p>Demo accounts:</p>
            <p>User: <strong>user@example.com</strong> / <strong>password</strong></p>
            <p>Admin: <strong>admin@example.com</strong> / <strong>admin123</strong></p>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default LoginModal;
