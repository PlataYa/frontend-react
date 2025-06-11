import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext"

export default function AuthLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (user) {
        return <Redirect href="/app/home" />;
    }

    return <Slot />;
}
