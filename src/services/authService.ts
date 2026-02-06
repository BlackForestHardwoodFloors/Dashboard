import axios from 'axios'

// Base API URL - adjust to your backend endpoint
const API_BASE_URL = 'http://localhost:5000/api/auth'

export const authService = {
  // Send password reset email
  async sendPasswordResetEmail(email: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to send password reset email'
      )
    }
  },

  // Reset password
  async resetPassword(email: string | null, token: string | null, newPassword: string) {
    if (!email || !token) {
      throw new Error('Invalid reset link')
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        token,
        newPassword
      })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to reset password'
      )
    }
  }
}

// Export individual functions for easier import
export const sendPasswordResetEmail = authService.sendPasswordResetEmail
export const resetPassword = authService.resetPassword