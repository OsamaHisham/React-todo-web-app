// Imports for app components 
import React from 'react';
import Signup from "./Signup";
import Login from "./Login";
import Title from "./Title";
import AddToDo from "./AddToDo";
import DisplayToDo from "./TodoDisplay";
import ForgotPassword from './ForgotPassword';
// For the privateRoute to prevent access to dashboard page without login first
import PrivateRoute from './PrivateRoute';
// react bootstrap components
import { Container, Button } from "react-bootstrap";
// Firbease authentication
import { AuthProvider } from "../contexts/AuthContext";
// React Routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// To be able to authenticate each user account 
import { useAuth } from '../contexts/AuthContext'
// For redirection to the login page
import { useNavigate } from 'react-router-dom'
// Firestore imports for database managment
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, where } from "firebase/firestore";
// importing database setup (from firestore.js)
import { db } from "../firebase";


// Function to render all of the components in the Dashboard of the todo app
function TodoDashboard(){
  const [todos, setTodos] = React.useState([]); // uses state hook 
  const { currentUser } = useAuth(); // Get the authenticated user

  const [error, setError] = React.useState("")
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Handling user Log out 
  async function handleLogOut(){
    // clearing out our error
    setError("")

    try {
      await logout()
      navigate.push("/login")
    } catch (err) {
      // setError(err.message)
      setError("Failed to log out")
    }
  }

  // Fetching  and displaying data from Firebase db (using use effect hook)
  // - {query, collection, db, onSnapshot, doc} methods
  // - {setTodos} use state hook (to rerender the UI)
  // - {where} filtering method
  React.useEffect(() => {
    // If user is authenticated retrieve the data
    if (currentUser){
      const q = query(
        collection(db, "toDo_items"),
        where("userId", "==", currentUser.uid) // Filter by user's UID
        );

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let todosArray = [];
      QuerySnapshot.forEach((doc) => {
        todosArray.push({...doc.data(), id: doc.id});
      });
      setTodos(todosArray);
    });

    return () => unsubscribe();
    } else{
      // User is not authenticated, set todos to an empty array or handle as needed
      setTodos([]); // Mofdify
    }


  }, [currentUser]); // Re-run effect when the user logs in or out

  // Handle edit function (edit an existing todo)
  // - {updateDoc, doc, db}  methods
  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "toDo_items", todo.id), { title: title });
  };

  // toggle todo function (update a completed to do item)
  // - {updateDoc, doc, db}  methods
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "toDo_items",todo.id),{
      completed: !todo.completed
    });
  };

  // handle Delete function (delete the selected todo from the db)
  // - {deleteDoc, doc, db}  methods
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "toDo_items",id));
  };

  return (
    <div className="App">
      <div>
        <Title />
      </div>
      <div>
        <AddToDo />
      </div>
      <div className="todo_container">
        {todos.map((todo) => (
          <DisplayToDo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogOut} className="log-out-link">Log Out</Button>
      </div>
    </div>
  );
}

function App() {
  return (
    
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Router>
          <AuthProvider>
              {/* <Routes></Routes> are used instead of <Switch></Switch> since React Router v6 */}
            <Routes> 
              <Route path="/signup" element={<Signup/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              {/* Private routes to prevent the user from accessing without being loged in */}
              <Route element={<PrivateRoute/>}>
                <Route path="/" element={<TodoDashboard />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
