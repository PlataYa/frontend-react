import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterCard from '../components/RegisterCard';

const RegisterScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <RegisterCard />
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});
