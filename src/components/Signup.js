// imports for libraries used
import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  // ~~~~~~~~~~~ Variables ~~~~~~~~~~~

  // useRef variables 
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  // signup authentication
  const { signup, verificationEmail } = useAuth()
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

    // Validation Check for the password
    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      setError('Passwords do not match!')
      return
    }

    // try and catch block (async function)
    try {
      // set error back to default state 
      setError('')
      // A loading state to prevent multiple request at the same time
      setLoading(true)
      // calling the signup function
      await signup(emailRef.current.value, passwordRef.current.value)
      // // calling the verifiction email function
      await verificationEmail()
      
      // Successful signup
      navigate('/login')

    } catch(err){
      // In case the email already exists
      if (err.message === 'Email is already in use. Please use a different email or try logging in.'){
        setError(err.message);
      }
      else{
        // Handling other errors
        setError('Failed to create an account :(')
      }
    }
    // after waiting for the signup
    setLoading(false)
  }

  // ~~~~~~~~~~~ return part for the component ~~~~~~~~~~~

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login" className='auth-link'>Login In</Link> 
      </div>
    </>
  )
}
