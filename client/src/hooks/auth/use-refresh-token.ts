import { refreshToken } from "@/apis/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";

export const useRefreshToken = () => {
    const { setAccessToken, setRefreshToken, setUser, refreshToken: refresh, user } = useAuthStore();
    return useMutation({
        mutationFn: async () => {
            const response = await refreshToken(refresh!, user!.id, user!.email);
            setAccessToken(response.tokens.accessToken);
            setRefreshToken(response.tokens.refreshToken);
            setUser(response.user);
            return true;
        },
        onError: (error) => {
            console.error("Refresh token error:", error);
        },
    })
}