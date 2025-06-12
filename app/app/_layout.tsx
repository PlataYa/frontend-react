import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext"

export default function ProtectedLayout() {
    const { user, isRestoring } = useAuth();

    if (isRestoring) return null;

    if (!user) {
        return <Redirect href="/auth/login" />;
    }

    return <Slot />;
}
