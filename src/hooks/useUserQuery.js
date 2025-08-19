import {authKeys} from "./useAuthQuery.js";
import * as userService from "../services/userService.js";
import useAuthStore from "../store/useAuthStore.js";
import {useQuery} from "@tanstack/react-query";
import useUserStore from "../store/useUserStore.js";

export const useUserProfile = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const userId = useUserStore((state) => state.userId);
    
    return useQuery({
            queryKey: authKeys.profile(userId),
        queryFn: () => userService.getUserById(userId),
        enabled: isAuthenticated && !!userId,
});
};