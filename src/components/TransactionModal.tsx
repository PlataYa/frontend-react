import React, { useState } from 'react';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (cvu: string, amount: string) => void;
    type: 'transfer' | 'deposit' | 'withdraw';
}

const TransactionModal: React.FC<Props> = ({ visible, onClose, onSubmit, type }) => {
    const [cvu, setCvu] = useState('');
    const [amount, setAmount] = useState('');

    const title = {
        transfer: 'Transferir a CVU',
        deposit: 'Ingresar fondos',
        withdraw: 'Sacar fondos',
    }[type];

    const handleSubmit = () => {
        onSubmit(cvu, amount);
        setCvu('');
        setAmount('');
        onClose();
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
            <div className="card" style={{
                margin: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                minWidth: '300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
                    {title}
                </h3>
                {type === 'transfer' && (
                    <input 
                        type="number"
                        placeholder="CVU destino" 
                        className="input"
                        onChange={(e) => setCvu(e.target.value)} 
                        value={cvu}  
                        style={{ marginBottom: '12px' }}
                    />
                )}
                <input 
                    type="number"
                    placeholder="Monto" 
                    className="input"
                    onChange={(e) => setAmount(e.target.value)} 
                    value={amount}
                    style={{ marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button className="button" onClick={onClose} style={{ backgroundColor: '#ccc', color: '#000' }}>
                        Cancelar
                    </button>
                    <button className="button" onClick={handleSubmit}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
