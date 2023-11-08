/**
 * The PrivateRoute component checks if there is a current user and renders the Outlet component if
 * there is, otherwise it navigates to the login page.
 * @returns The PrivateRoute component returns the Outlet component if there is a currentUser,
 * indicating that the user is authenticated. If there is no currentUser, indicating that the user is
 * not authenticated, it returns the Navigate component with a "to" prop set to "/login", which will
 * navigate the user back to the login page.
 */

import React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute() {
  const { currentUser } = useAuth()
  return (
    currentUser ? <Outlet /> : <Navigate to="/signup" />
  )
}