import { Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/app/HomeScreen';
// TODO: Import your main screens here
// import HomeScreen from '../screens/app/HomeScreen';
// import WalletScreen from '../screens/app/WalletScreen';

// Temporary placeholder components  
const WalletScreen = () => <div className="container"><div className="card"><h2>Billetera</h2><p>Implementar pantalla de billetera</p></div></div>;

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/wallet" element={<WalletScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 