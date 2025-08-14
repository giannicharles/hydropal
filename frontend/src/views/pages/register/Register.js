import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import api from 'src/services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      setSuccess('Account created successfully! Redirecting to Login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Registration error:', err)
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Backend returned error response
        errorMessage = err.response.data.message || 
                       err.response.data.error || 
                       errorMessage;
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server. Check your network connection.';
      } else if (err.message.includes('Network Error')) {
        // Network issues
        errorMessage = 'Network error. Please check your connection to the server.';
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  
                  {success && <CAlert color="success">{success}</CAlert>}
                  {error && <CAlert color="danger">{error}</CAlert>}
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      name="name"
                      placeholder="Full Name" 
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      name="email"
                      placeholder="Email" 
                      autoComplete="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton 
                      color="success" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                    </CButton>
                  </div>
                  <div className="mt-3 text-center">
                    Already have an account? 
                    <CButton 
                      color="link" 
                      onClick={() => navigate('/login')}
                      className="px-0"
                    >
                      Login
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
