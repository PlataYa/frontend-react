import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './navigation/AppRouter';

export default function App() {
  return (
    <AuthProvider>
        <Router>
            <AppRouter />
        </Router>
        <ToastContainer />
    </AuthProvider>
  );
} 