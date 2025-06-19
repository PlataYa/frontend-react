import { Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/app/HomeScreen';
import TransferScreen from '../screens/app/TransferScreen';
import WithdrawScreen from '../screens/app/WithdrawScreen';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/transfer" element={<TransferScreen />} />
      <Route path="/withdraw" element={<WithdrawScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

