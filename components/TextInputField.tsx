import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface Props {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    placeholder?: string;
}

const TextInputField: React.FC<Props> = ({ label, value, onChangeText, secureTextEntry = false, keyboardType = 'default', placeholder }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                placeholder={placeholder ? placeholder : label}
                placeholderTextColor="#aaa"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
    },
});

export default TextInputField;
