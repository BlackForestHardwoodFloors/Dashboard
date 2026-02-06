import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/authService'

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await resetPassword(email, token, newPassword)
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Password successfully reset. Please log in.' 
        } 
      })
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="reset-password-container">
      <form onSubmit={handleResetPassword}>
        <h2>Create New Password</h2>
        
        <input 
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />

        <input 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage