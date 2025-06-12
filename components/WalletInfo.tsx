import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WalletResponseDTO } from '@/dto/wallet.dto';

interface Props {
    wallet: WalletResponseDTO;
}

const WalletInfo: React.FC<Props> = ({ wallet }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>CVU: {wallet.cvu}</Text>
            <Text style={styles.text}>Balance: ${wallet.balance}</Text>
        </View>
    );
};

export default WalletInfo;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#eee',
        borderRadius: 8,
        margin: 16,
        width: 300,
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
});
