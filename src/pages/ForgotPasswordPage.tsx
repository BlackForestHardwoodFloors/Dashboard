import React, { useState } from 'react'
import { sendPasswordResetEmail } from '../services/authService'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Validate email format
      if (!validateEmail(email)) {
        throw new Error('Invalid email format')
      }

      // Send password reset request
      const result = await sendPasswordResetEmail(email)
      
      setMessage('Password reset link sent to your email. Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleForgotPassword}>
        <h2>Reset Your Password</h2>
        
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="additional-options">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  )
}

// Email validation utility
function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(String(email).toLowerCase())
}

export default ForgotPasswordPage