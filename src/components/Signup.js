// imports for libraries used
import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
// React icons for password visibility
import { Icon } from 'react-icons-kit'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import {eye} from 'react-icons-kit/feather/eye'

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
  // to deal with show/hide password states
  const [mainPassType, setMainPassType] = useState('password')
  const [mainPassIcon, setMainPassIcon] = useState(eyeOff)
  const [PassConfType, setPassConfType] = useState('password')
  const [PassConfIcon, setPassConfIcon] = useState(eyeOff)


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

  // Function to handle the password toggle Icon
  const handleMainPassToggle = () => {
    // Check the type of input for main password
    if (mainPassType === 'password'){
      setMainPassIcon(eye)
      setMainPassType('text')
    } else {
      setMainPassIcon(eyeOff)
      setMainPassType('password')
    }
  }
  // Function to handle the password toggle Icon
  const handlePassConfToggle = () => {
    // Check the type of input for confirm password
    if (PassConfType === 'password'){
      setPassConfIcon(eye)
      setPassConfType('text')
    } else {
      setPassConfIcon(eyeOff)
      setPassConfType('password')
    }
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
              <Form.Label>Email*</Form.Label>
              <Form.Control type="email" ref={emailRef} required placeholder='samDevelopment@example.com'/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label className="mt-2">Password*</Form.Label>
              <div className='password-field'>
                <Form.Control type={mainPassType} ref={passwordRef}required />
                <span className='password-toggle-icon' onClick={handleMainPassToggle}>
                  <Icon icon={mainPassIcon}/>
                </span>
              </div>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label className="mt-2">Password Confirmation*</Form.Label>
              <div className='password-field'>
                <Form.Control type={PassConfType} ref={passwordConfirmRef} required />
                <span className='password-toggle-icon' onClick={handlePassConfToggle}>
                  <Icon icon={PassConfIcon}/>
                </span>
              </div>
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4 btnSignUp" type="submit">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login" className='auth-link'>Log In</Link> 
      </div>
    </>
  )
}
