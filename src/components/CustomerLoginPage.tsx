import { useState } from 'react';
import { Eye, EyeOff, LogIn, User } from 'lucide-react';

interface CustomerLoginPageProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export default function CustomerLoginPage({ onLogin, error, isLoading }: CustomerLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const accentColor = '#2196F3';
  const accentDark = '#1976D2';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E0E0E0'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: accentColor,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: `0 8px 24px rgba(33, 150, 243, 0.3)`
          }}>
            <User size={40} color="#FFFFFF" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1A1A1A',
            margin: '0 0 8px 0'
          }}>
            Customer Portal
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666666',
            margin: 0
          }}>
            View your projects & quotes
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid #DC3545',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#DC3545',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>!</span>
            </div>
            <span style={{ color: '#DC3545', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: accentColor,
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                backgroundColor: '#F5F7FA',
                border: `2px solid ${emailFocused ? accentColor : '#E0E0E0'}`,
                borderRadius: '10px',
                color: '#1A1A1A',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: accentColor,
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 16px',
                  fontSize: '15px',
                  backgroundColor: '#F5F7FA',
                  border: `2px solid ${passwordFocused ? accentColor : '#E0E0E0'}`,
                  borderRadius: '10px',
                  color: '#1A1A1A',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666666" />
                ) : (
                  <Eye size={20} color="#666666" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              backgroundColor: isLoading ? '#64B5F6' : accentColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : `0 4px 0 0 ${accentDark}, 0 6px 12px rgba(33, 150, 243, 0.3)`,
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFFFFF',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Please wait...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Log In to My Account
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: accentColor,
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Other Portal Links */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #E0E0E0',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666666', fontSize: '13px', marginBottom: '12px' }}>
            Are you a team member?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="/admin/login" style={{
              color: '#C9A049',
              fontSize: '13px',
              textDecoration: 'none'
            }}>
              Admin Portal
            </a>
            <span style={{ color: '#E0E0E0' }}>|</span>
            <a href="/employee/login" style={{
              color: '#4CAF50',
              fontSize: '13px',
              textDecoration: 'none'
            }}>
              Employee Portal
            </a>
          </div>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
