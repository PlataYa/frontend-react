import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginCard from '../components/LoginCard';

const LoginScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <LoginCard />
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});
