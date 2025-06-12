import React from 'react';
import { Image, View, Pressable, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    onPress: () => void;
    img: string;
}

const TransactionButton: React.FC<Props> = ({ label, onPress, img }) => {

    const icons: Record<string, any> = {
        deposit: require("@/assets/deposit.png"),
        withdraw: require("@/assets/withdraw.png"),
        transfer: require("@/assets/transfer.png"),
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <Pressable onPress={onPress} style={styles.button}>
                <Image style={styles.image} source={icons[img]} />
            </Pressable>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

export default TransactionButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(85,0,253,0.15)',
        borderRadius: 40,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    label: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5500fd',
        width: 80,
    },
    image: {
        width: 40,
        height: 40,
    },
});
