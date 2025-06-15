import { Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/app/HomeScreen';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 