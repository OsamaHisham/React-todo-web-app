import React from 'react'
// Icon imports
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TodoDisplay({
  // Defining prompts that will be handled
  todo,
  toggleComplete,
  handleDelete,
  handleEdit,
}) {
  // title state for storing th todo title (useState hook)
  const[newTitle, setNewTitle] = React.useState(todo.title);

  // Function to handle changes
  const handleChange = (event) => {
    // Prevent default refresh
    event.preventDefault();

    // Chacking if the todo is completed
    if (todo.complete === true) {
      setNewTitle(todo.title);
    } else{
      todo.title = "";
      setNewTitle(event.target.value);
    }
  };

  return (
    // Main To do container 
    <div className="todo">
      {/* Input section */}
      <input 
        style = {{textDecoration: todo.completed && "line-through"}}
        type = "text"
        value = {todo.title === "" ? newTitle : todo.title}
        className = "list"
        onChange = {handleChange}
      />
      {/* Main buttons container */}
      <div>
        {/* button to toggle status of todo (true/false)*/}
        <button
          className = "button-complete"
          onClick = {()=> toggleComplete(todo)}
        >
          <CheckCircleIcon id="i"/>
        </button>
        {/* button to edit an existing todo */}
        <button
          className = "button-edit"
          onClick = {()=> handleEdit(todo, newTitle)}
        >
          <EditIcon id="i"/>
        </button>
        {/* button to delete an existing todo */}
        <button
          className = "button-delete"
          onClick = {()=> handleDelete(todo.id)}
        >
          <DeleteIcon id="i"/>
        </button>
      </div>
    </div>
  );
}
