// imports from react
import React, { useContext, useState, useEffect } from 'react'
// Imports for Firebase
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { signOut } from 'firebase/auth'

// Creating an authentication context
const AuthContext = React.createContext()

// function to use the context
export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  // Function to sign up a new user
  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use. Please use a different email or try logging in.');
      } else{
        throw error; // Rethrow the error for handling in the Signup component
      }
    }
  }

  // Function to send a verification email to the new user
  async function verificationEmail() {
    try {
      return await sendEmailVerification(auth.currentUser)
    } catch (error) {
      throw error; // Rethrow the error for handling in the Signup component
    }
  }

  // Function to Log In an existing user
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user email is verified first (Throw new error to Login Component)
      if (!user.emailVerified) {
        throw new Error('Email not verified. Please check your email for a verification link.')
        
      }
      return user;
    } catch (error) {
      throw error; // Rethrow the error for handling in the Signup component
    }
  }

  // Function to signout the user
  async function logout(){
    return await signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      throw error; // Rethrow the error for handling in the Signup component
    });
  }

  // Function to Reset the password
  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent! ==> Implemented in ForgotPassword.js component
      })
      .catch((error) => {
        return error.message;
      });
  }

  // Setting the currentUser constant using the (onAuthStateChanged) function that is provided by firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])


  // information value object for the authentication provider using firebase to set the current user
  const value = {
    currentUser,
    signup,
    login,
    verificationEmail,
    logout,
    resetPassword,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
