import { useEffect, useState } from 'react';
import TransactionButton from '../../components/TransactionButton';
import TransactionModal from '../../components/TransactionModal';
import WalletInfo from '../../components/WalletInfo';
import { useAuth } from '../../context/AuthContext';
import { WalletResponseDTO } from '../../dto/wallet.dto';
import { depositToWallet, getWalletByMail, sendP2PTransaction, validateCVU, withdrawFromWallet } from '../../services/api';

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const loadWallet = async () => {
        if (!user?.mail) return;
        try {
            const result = await getWalletByMail(user.mail);
            setWallet(result);
        } catch (err) {
            alert("Error: No se pudo obtener la billetera");
        }
    };

    useEffect(() => {
        loadWallet();
    }, [user]);

    const handleTransfer = async (cvu: string, amount: string) => {
        const valid = await validateCVU(Number(cvu));
        if (!valid) {
            alert("CVU inválido: No se encontró una cuenta con ese CVU");
            return;
        }
        await sendP2PTransaction({
            payerCvu: user.cvu,
            payeeCvu: Number(cvu),
            amount: Number(amount),
            currency: "ARS",
        });
        setShowTransfer(false);
        await loadWallet();
        alert("Éxito: Transferencia realizada");
    };

    const handleDeposit = async (_: string, amount: string) => {
        await depositToWallet({ payeeCvu: user.cvu, amount: Number(amount), currency: "ARS", externalReference: "manual_deposit" });
        setShowDeposit(false);
        await loadWallet();
        alert("Éxito: Depósito realizado");
    };

    const handleWithdraw = async (_: string, amount: string) => {
        await withdrawFromWallet({ payerCvu: user.cvu, amount: Number(amount), currency: "ARS", externalReference: "manual_withdraw" });
        setShowWithdraw(false);
        await loadWallet();
        alert("Éxito: Extracción realizada");
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
                <TransactionButton label="Transferir" onPress={() => setShowTransfer(true)} />
                <TransactionButton label="Depositar" onPress={() => setShowDeposit(true)} />
                <TransactionButton label="Extraer" onPress={() => setShowWithdraw(true)} />
            </div>

            <TransactionModal visible={showTransfer} onClose={() => setShowTransfer(false)} onSubmit={handleTransfer} type="transfer" />
            <TransactionModal visible={showDeposit} onClose={() => setShowDeposit(false)} onSubmit={handleDeposit} type="deposit" />
            <TransactionModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} onSubmit={handleWithdraw} type="withdraw" />

            <button 
                className="button" 
                onClick={logout}
                style={{ marginTop: '30px', backgroundColor: '#6C63FF', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
                Cerrar sesión
            </button>
        </div>
    );
} 