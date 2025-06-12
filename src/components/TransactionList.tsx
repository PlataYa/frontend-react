import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TransactionResponseDTO } from "../dto/transaction.dto";
import { getTransactionHistory } from "../services/api";

export default function TransactionsList() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);

    useEffect(() => {
        if (user?.cvu) {
            getTransactionHistory(user.cvu).then(setTransactions);
        }
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES');
    };

    const getTransactionDetails = (transaction: TransactionResponseDTO) => {
        return {
            from: transaction.payerCvu,
            to: transaction.payeeCvu,
            description: transaction.type === 'P2P' ? 'Transferencia PlataYa' : 'WITHDRAWAL' ? "Extracción a cuenta externa" : "Deposito de cuenta externa"
        };
    };

    return (
        <div style={{ maxWidth: '300px', marginTop: '20px' }}>
            {transactions.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No hay transacciones recientes.</p>
            ) : (
                transactions.map((item) => {
                    const details = getTransactionDetails(item);
                    return (
                        <div key={item.transactionId} style={{
                            backgroundColor: '#f0f0f0',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}>
                            <p><strong>{details.description}</strong></p>
                            <p>Monto: ${item.amount} {item.currency}</p>
                            <p>Fecha: {formatDate(item.createdAt)}</p>
                            <p>Estado: {item.status}</p>
                            <p>Desde: {details.from}</p>
                            <p>Hacia: {details.to}</p>
                            {item.externalReference && (
                                <p>Referencia: {item.externalReference}</p>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
