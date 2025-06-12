import { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { TransactionResponseDTO } from "../dto/transaction.dto";

export default function TransactionsList() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);

    useEffect(() => {
        if (user?.cvu) {
            getTransactionHistory(user.cvu).then(setTransactions);
        }
    }, [user]);

    return (
        <div style={{ maxWidth: '300px', marginTop: '20px' }}>
            {transactions.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No hay transacciones recientes.</p>
            ) : (
                transactions.map((item) => (
                    <div key={item.id} style={{
                        backgroundColor: '#f0f0f0',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '10px'
                    }}>
                        <p><strong>{item.type}</strong></p>
                        <p>Monto: ${item.amount} {item.currency}</p>
                        <p>Fecha: {item.timestamp}</p>
                        <p>Estado: {item.status}</p>
                        <p>Desde: {item.payerCvu}</p>
                        <p>Hacia: {item.payeeCvu}</p>
                    </div>
                ))
            )}
        </div>
    );
}
