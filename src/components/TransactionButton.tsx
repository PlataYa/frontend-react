import React from 'react';

interface Props {
    label: string;
    onPress: () => void;
    img: 'withdraw' | 'transfer';
}

const icons: Record<string, string> = {
    withdraw: require('../assets/withdraw.png'),
    transfer: require('../assets/transfer.png'),
};

const TransactionButton: React.FC<Props> = ({ label, onPress, img }) => (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <button
            onClick={onPress}
            style={{
                backgroundColor: 'rgba(85,0,253,0.15)',
                borderRadius: '40px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '10px',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            <img src={icons[img]} alt={label} style={{ width: '40px', height: '40px' }} />
        </button>
        <span style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#5500fd', width: '80px' }}>{label}</span>
    </div>
);

export default TransactionButton;
