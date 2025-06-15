import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TransactionButton from '../../components/TransactionButton';
import TransactionsList from "../../components/TransactionList";
import TransactionModal from '../../components/TransactionModal';
import WalletInfo from '../../components/WalletInfo';
import { useAuth } from '../../context/AuthContext';
import { WalletResponseDTO } from '../../dto/wallet.dto';
import { getWalletByMail, sendP2PTransaction, validateCVU, withdrawFromWallet } from '../../services/api';

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [transactionUpdated, setTransactionUpdated] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleTransfer = async (cvu: string, amount: string) => {

        const parsedAmount = Number(amount);
        const parsedCvu = Number(cvu);

        if (parsedAmount > wallet?.balance) {
            setError('Saldo insuficiente. Saldo disponible: ' + wallet?.balance);
            return;
        }

        try {
            const valid = await validateCVU(parsedCvu);
            if (!valid) {
                setError('CVU inválido: No se encontró una cuenta con ese CVU');
                return;
            }

            await sendP2PTransaction({
                payerCvu: user.cvu,
                payeeCvu: parsedCvu,
                amount: parsedAmount,
                currency: "ARS",
            });

            await loadWallet();
            refreshTransactions();
            setShowTransfer(false);
            toast.success('Transferencia realizada exitosamente');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleWithdraw = async (destinationCvu: string, amount: string) => {

        const parsedAmount = Number(amount);
        const parsedCvu = Number(destinationCvu);

        if (parsedAmount > wallet?.balance) {
            setError('Saldo insuficiente. Saldo disponible: ' + wallet?.balance);
            return;
        }

        try {
             await withdrawFromWallet({
                sourceCvu: user.cvu,
                destinationCvu: parsedCvu,
                amount: parsedAmount,
                currency: "ARS"
            });

            await loadWallet();
            refreshTransactions();
            setShowWithdraw(false);
            toast.success('Retiro realizado exitosamente');
        } catch (error: any) {
            if (error.message.includes('not found')) {
                setError('CVU inválido: No se encontró una cuenta con ese CVU');
            } else {
                setError(error.message);
            }
        }
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
                <TransactionButton id="transfer-button" img="transfer" label="Transferir a PlataYa" onPress={() => setShowTransfer(true)} />
                <TransactionButton id="withdraw-button" img="withdraw" label="Transferir a cuenta externa" onPress={() => setShowWithdraw(true)} />
            </div>

            <TransactionModal error={error} setError={setError} visible={showTransfer} onClose={() => setShowTransfer(false)} onSubmit={handleTransfer} type="transfer" />
            <TransactionModal error={error} setError={setError} visible={showWithdraw} onClose={() => setShowWithdraw(false)} onSubmit={handleWithdraw} type="withdraw" />

            <TransactionsList key={transactionUpdated.toString()} />

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
