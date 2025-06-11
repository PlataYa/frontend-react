import {View, StyleSheet, Text} from "react-native";
import LoginCard from "@/components/LoginCard";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {

    return(
        <View style={styles.container}>
            {}
            <LoginCard/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0"
    },
    text: {
        fontSize: 24,
        color: "#333"
    }
});