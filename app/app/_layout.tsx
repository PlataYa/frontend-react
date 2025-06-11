import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext"

export default function ProtectedLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!user) {
        return <Redirect href="/auth/login" />;
    }

    return <Slot />;
}
