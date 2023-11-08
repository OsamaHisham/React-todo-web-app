// imports for libraries used
import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  // ~~~~~~~~~~~ Variables ~~~~~~~~~~~

  // useRef variables 
  const emailRef = useRef()
  const passwordRef = useRef()
  // signup authentication
  const { login } = useAuth()
  // error states (empty by default)
  const [error, setError] = useState('')
  // loading states (manage requests to firebase server)
  const [loading, setLoading] = useState(false)
  // To redirect to dashboard page
  const navigate = useNavigate()

  // ~~~~~~~~~~~ handleSubmit function ~~~~~~~~~~~

  // using authentication to handle Form submission event
  async function handleSubmit(e){
    // Prevent the default Form refresh
    e.preventDefault()

    // try and catch block (async function)
    try {
      // set error back to default state 
      setError('')
      // A loading state to prevent multiple request at the same time
      setLoading(true)
      // calling the signup function
      await login(emailRef.current.value, passwordRef.current.value)
      // Successful login
      navigate('/todo')
    } catch(err){
      // In case the email is not verified first
      if (err.message === 'Email not verified. Please check your email for a verification link.'){
        setError(err.message);
      }
      else{
        // Handling other errors
        setError('Failed to Log in')
      }
    }
    // after waiting for the signup
    setLoading(false)
  }

  // ~~~~~~~~~~~ return part for the component ~~~~~~~~~~~

  return (
    <>
      <Card className="mt-4" style={{mixWidth:"700px"}}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Form for submitting user login credentials*/}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">Log In</Button>
          </Form>
          {/* Forgetten Password section */}
          <div className='w-100 text-center mt-2'>
            <Link to="/forgot-password" className='auth-link'>Forgot Password</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup" className='auth-link'>Sign Up</Link>
      </div>
    </>
  )
}
