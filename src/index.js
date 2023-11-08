import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
//imports for styling 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styling/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
