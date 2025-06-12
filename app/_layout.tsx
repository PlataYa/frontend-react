import { Slot } from "expo-router";
import {AuthProvider} from "@/context/AuthContext";
import AddNavbar from "@/components/AddNavbar";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Slot/>
        </AuthProvider>
    )
}
