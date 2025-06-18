import React, { useState } from 'react';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (cvu: string, amount: string) => void;
    type: 'transfer' | 'withdraw' | 'deposit';
    error?: string;
    setError?: (error: string) => void;
}

const TransactionModal: React.FC<Props> = ({ visible, onClose, onSubmit, type, error, setError }) => {
    const [cvu, setCvu] = useState('');
    const [amount, setAmount] = useState('');

    const title = {
        transfer: 'Transferir a CVU PlataYa',
        withdraw: 'Transferir a cuenta externa',
        deposit: 'Ingresar dinero a PlataYa',
    }[type];

    const cvuPlaceholder = {
        transfer: 'CVU destino PlataYa',
        withdraw: 'CVU cuenta externa',
        deposit: 'CVU cuenta externa',
    }[type];

    const handleSubmit = () => {
        setError('');

        if (!cvu && !amount) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!amount) {
            setError("Monto requerido. Por favor, ingrese un monto.");
            return;
        }

        if (!cvu) {
            setError("CVU requerido. Por favor, ingrese un CVU.");
            return;
        }

        if (type=="transfer" && !/^\d{12}$/.test(cvu)) {
            setError("CVU inválido. Debe tener 12 dígitos.");
            return;
        }

        const monto = Number(amount);
        if (!/^\d+(\.\d{1,2})?$/.test(amount) || monto <= 0) {
            setError("Monto inválido. Debe ser un número positivo.");
            return;
        }

        onSubmit(cvu, amount);
        setCvu('');
        setAmount('');
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
        }}>
            <div data-testid="transaction-modal" className="card" style={{
                margin: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                minWidth: '300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>{title}</h3>
                <input
                    id="cvu-input"
                    type="number"
                    placeholder={cvuPlaceholder}
                    className="input"
                    onChange={(e) => setCvu(e.target.value)}
                    value={cvu}
                    style={{ marginBottom: '12px' }}
                />
                <input
                    id="amount-input"
                    type="number"
                    placeholder="Monto"
                    className="input"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    style={{ marginBottom: '12px' }}
                />
                {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button className="button" onClick={onClose} style={{ backgroundColor: '#ccc', color: '#000' }}>
                        Cancelar
                    </button>
                    <button id="submit-button" className="button" onClick={handleSubmit}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
