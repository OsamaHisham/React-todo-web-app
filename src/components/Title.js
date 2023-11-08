import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'

export default function Title() {
  const { currentUser } = useAuth()

  return (
    <Container className="title text-center mt-5 p-2">
      <div className='user-email'>
        <strong>Email: </strong>{currentUser.email}
      </div>
      <h1>Todo App</h1>
    </Container>
  );
}