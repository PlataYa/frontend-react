import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    onPress: () => void;
}

const TransactionButton: React.FC<Props> = ({ label, onPress }) => (
    <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.label}>{label}</Text>
    </Pressable>
);

export default TransactionButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#EDEDED',
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
    },
});
