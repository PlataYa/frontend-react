import {View, StyleSheet} from "react-native";
import LoginCard from "@/components/LoginCard";

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