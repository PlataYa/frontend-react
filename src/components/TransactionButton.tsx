import React from 'react';

interface Props {
    label: string;
    onPress: () => void;
}

const TransactionButton: React.FC<Props> = ({ label, onPress }) => (
    <button 
        onClick={onPress} 
        style={{
            backgroundColor: '#ececed',
            borderRadius: '16px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#5500fd',
            textAlign: 'center'
        }}
    >
        {label}
    </button>
);

export default TransactionButton;
