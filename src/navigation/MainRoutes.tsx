import { Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/app/HomeScreen';
import TransferScreen from '../screens/app/TransferScreen';
import WithdrawScreen from '../screens/app/WithdrawScreen';

// Temporary placeholder components  
const WalletScreen = () => <div className="container"><div className="card"><h2>Billetera</h2><p>Implementar pantalla de billetera</p></div></div>;

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/wallet" element={<WalletScreen />} />
      <Route path="/transfer" element={<TransferScreen />} />
      <Route path="/withdraw" element={<WithdrawScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

