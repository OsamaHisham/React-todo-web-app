// imports for libraries used
import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  // ~~~~~~~~~~~ Variables ~~~~~~~~~~~

  // useRef variables 
  const emailRef = useRef()
  // signup authentication
  const { resetPassword } = useAuth()
  // error states (empty by default)
  const [error, setError] = useState('')
  // message states (empty by default)
  const [message, setMessage] = useState('')
  // loading states (manage requests to firebase server)
  const [loading, setLoading] = useState(false)

  // ~~~~~~~~~~~ handleSubmit function ~~~~~~~~~~~

  // using authentication to handle Form submission event
  async function handleSubmit(e){
    // Prevent the default Form refresh
    e.preventDefault()

    // try and catch block (async function)
    try {
      // Reseting the message
      setMessage('')
      // set error back to default state 
      setError('')
      // A loading state to prevent multiple request at the same time
      setLoading(true)
      // Reset Password method
      await resetPassword(emailRef.current.value)
      // Success message 
      setMessage('Check Your email for further instructions')
    } catch(err){
      setError('Failed to Reset Password')
    }
    // after waiting for the signup
    setLoading(false)
  }

  // ~~~~~~~~~~~ return part for the component ~~~~~~~~~~~

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email*</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4 btnResetPassword" type="submit">Reset Password</Button>
          </Form>
          {/* redirection to login page */}
          <div className='w-100 text-center mt-3'>
            <Link to="/login" className='auth-link'>Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup" className='auth-link'>Sign Up</Link>
      </div>
    </>
  )
}
