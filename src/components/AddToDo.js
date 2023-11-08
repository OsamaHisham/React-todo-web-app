// Imports
import React from "react";
import { db } from "../firebase"
import { collection, addDoc } from "firebase/firestore";
import { Form } from "react-bootstrap";
// To be able to authenticate each user account 
import { useAuth } from '../contexts/AuthContext'

export default function AddToDo() {
  // Get the authenticated user
  const { currentUser } = useAuth(); 

  // Using a use state hook
  const [title, setTitle] = React.useState("");

  // handleSubmit async function to deal with the form submission
  const handleSubmit = async (e) => {
    // prevent default refresh
    e.preventDefault();

    // Validating the title before storing data in firebase
    if (title !== "") {
      // adding a new Doc to firebase
      await addDoc(collection(db, "toDo_items"), {
        title,
        completed: false,
        userId: currentUser.uid, // Add the user's UID to the todo item
      });
      setTitle("");
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="todo-form">
      {/* Container used to add input */}
      <div className="input_container">
        <input
          type="text"
          placeholder="Enter todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* Submit Button */}
      <div className="btn_container">
        <button>Add</button>
      </div>
    </Form>
  );
}