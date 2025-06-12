import React from 'react';
import { WalletResponseDTO } from '../dto/wallet.dto';

interface Props {
    wallet: WalletResponseDTO;
}

const WalletInfo: React.FC<Props> = ({ wallet }) => {
    return (
        <div className="card" style={{ padding: '16px', backgroundColor: '#eee', borderRadius: '8px', margin: '16px' }}>
            <p data-testid="wallet-cvu" style={{ fontSize: '16px', marginBottom: '8px' }}>CVU: {wallet.cvu}</p>
            <p data-testid="wallet-balance" style={{ fontSize: '16px', marginBottom: '8px' }}>Balance: ${wallet.balance}</p>
        </div>
    );
};

export default WalletInfo;
