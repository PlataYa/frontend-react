import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (user) {
        return <Redirect href="/app/home" />;
    }

    return <Slot />;
}
