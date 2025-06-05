import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import ActionsContainer from "../components/ActionsContainer";
import {useNavigation} from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation<any>();

    const buttonAction = () => {
        navigation.navigate('Transfer', {user});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido, {user.name} {user.lastname}</Text>
            <ActionsContainer action1={buttonAction} action2={buttonAction}/>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});
