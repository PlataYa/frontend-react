import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TransactionButton from '../../components/TransactionButton';
import TransactionsList from "../../components/TransactionList";
import WalletInfo from '../../components/WalletInfo';
import { useAuth } from '../../context/AuthContext';
import { WalletResponseDTO } from '../../dto/wallet.dto';
import { getWalletByMail } from '../../services/api';

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const [transactionUpdated, setTransactionUpdated] = useState(false);
    const navigate = useNavigate();

    const loadWallet = async () => {
        if (!user?.mail) return;
        try {
            const result = await getWalletByMail(user.mail);
            setWallet(result);
        } catch (err) {
            toast.error('No se pudo obtener la billetera');
        }
    };

    useEffect(() => {
        loadWallet();
    }, [user]);

    const refreshTransactions = () => setTransactionUpdated(prev => !prev);

    const handleNavigateToTransfer = () => {
        navigate('/transfer');
    };

    const handleNavigateToWithdraw = () => {
        navigate('/withdraw');
    };

    return (
        <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
            <img
                style={{ width: '100px', height: '100px', marginBottom: '20px' }}
                src={require("../../assets/logo.png")}
                alt="Logo"
            />
            <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                Bienvenido, {user?.name} {user?.lastname}
            </h2>
            {wallet ? (
                <WalletInfo wallet={wallet} />
            ) : (
                <p style={{ fontSize: '20px', color: '#333' }}>Cargando billetera...</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '20px 0' }}>
                <TransactionButton id="transfer-button" img="transfer" label="Transferir a PlataYa" onPress={handleNavigateToTransfer} />
                <TransactionButton id="withdraw-button" img="withdraw" label="Transferir a cuenta externa" onPress={handleNavigateToWithdraw} />
            </div>

            <button

              className="button"
              onClick={logout}
              style={{ marginTop: '30px', backgroundColor: '#6C63FF', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Cerrar sesión
            </button>
            <TransactionsList key={transactionUpdated.toString()} />
        </div>
    );
}
