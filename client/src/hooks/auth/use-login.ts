import { login } from "@/apis/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useLogin = () => {
    const { setAccessToken, setRefreshToken, setUser } = useAuthStore();
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await login(data.email, data.password);
            setAccessToken(response.tokens.accessToken);
            setRefreshToken(response.tokens.refreshToken);
            setUser(response.user);
            return true;
        },
        onSuccess: () => {
            toast.success("Login successful!");
        },
        onError: (error) => {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your credentials.");
        },
    })
}