import { useState } from 'react';
import { Eye, EyeOff, LogIn, HardHat } from 'lucide-react';

interface EmployeeLoginPageProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export default function EmployeeLoginPage({ onLogin, error, isLoading }: EmployeeLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const accentColor = '#4CAF50';
  const accentDark = '#388E3C';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#2D2D2D',
        borderRadius: '20px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid #3D3D3D'
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
            boxShadow: `0 8px 24px rgba(76, 175, 80, 0.3)`
          }}>
            <HardHat size={40} color="#FFFFFF" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: '0 0 8px 0'
          }}>
            Employee Portal
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#A0A0A0',
            margin: 0
          }}>
            Boardroom 360 Team Access
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
                backgroundColor: '#1A1A1A',
                border: `2px solid ${emailFocused ? accentColor : '#3D3D3D'}`,
                borderRadius: '10px',
                color: '#FFFFFF',
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
                  backgroundColor: '#1A1A1A',
                  border: `2px solid ${passwordFocused ? accentColor : '#3D3D3D'}`,
                  borderRadius: '10px',
                  color: '#FFFFFF',
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
                  <EyeOff size={20} color="#A0A0A0" />
                ) : (
                  <Eye size={20} color="#A0A0A0" />
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
              backgroundColor: isLoading ? '#2E7D32' : accentColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : `0 4px 0 0 ${accentDark}, 0 6px 12px rgba(76, 175, 80, 0.3)`,
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
                Log In as Employee
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
          borderTop: '1px solid #3D3D3D',
          textAlign: 'center'
        }}>
          <p style={{ color: '#A0A0A0', fontSize: '13px', marginBottom: '12px' }}>
            Not an employee?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="/admin/login" style={{
              color: '#C9A049',
              fontSize: '13px',
              textDecoration: 'none'
            }}>
              Admin Portal
            </a>
            <span style={{ color: '#3D3D3D' }}>|</span>
            <a href="/customer/login" style={{
              color: '#2196F3',
              fontSize: '13px',
              textDecoration: 'none'
            }}>
              Customer Portal
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
