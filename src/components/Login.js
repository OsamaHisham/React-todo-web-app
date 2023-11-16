// imports for libraries used
import React, { useRef, useState } from 'react'
// React Bootstrap components
import { Form, Button, Card, Alert } from 'react-bootstrap'
// Authentication fro AuthContext.js components
import { useAuth } from '../contexts/AuthContext'
// Handling Routing/Navigation 
import { Link, useNavigate } from 'react-router-dom'
// React icons for password visibility
import { Icon } from 'react-icons-kit'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import {eye} from 'react-icons-kit/feather/eye'

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
  // to deal with show/hide password states
  const [passType, setPassType] = useState('password')
  const [passIcon, setPassIcon] = useState(eyeOff)

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
      navigate('/')
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

  // Function to handle the password toggle Icon
  const handlePassToggle = () => {
    // Check the type of input
    if (passType === 'password'){
      setPassIcon(eye)
      setPassType('text')
    } else {
      setPassIcon(eyeOff)
      setPassType('password')
    }

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
              <Form.Label>Email*</Form.Label>
              <Form.Control type="email" ref={emailRef} placeholder='SamDevelopment@example.com' required/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password*</Form.Label>
              <div className='password-field'>
                <Form.Control type={passType} ref={passwordRef} secureTextEntry={false} required/>
                <span className='password-toggle-icon' onClick= {handlePassToggle}>
                  <Icon icon={passIcon}/>
                </span>
              </div>
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4 btnLogIn" type="submit">Log In</Button>
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
