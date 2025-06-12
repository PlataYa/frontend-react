import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Las variables de entorno en React se acceden directamente a través de process.env.REACT_APP_*
console.log('API URL:', process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
