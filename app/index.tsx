import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    return <Redirect href={user ? "/app/home" : "/auth/login"} />;
}
