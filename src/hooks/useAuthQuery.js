import {useMutation, useQueryClient} from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore.js";
import {jwtDecode} from "jwt-decode";
import useUserStore from "../store/useUserStore.js";
import * as authService from "../services/authService.js";

export const authKeys = {
 all: ['auth'],
 profiles: () => [...authKeys.all, 'profile'], // General key for all profiles
 profile: (userId) => [...authKeys.profiles(), userId], // Specific user profile
};


export const useAuth = () => {
 const queryClient = useQueryClient();
 const { login } = useAuthStore();
 const {setUser} = useUserStore();
 const { mutate: loginMutation, isPending: isLoginPending } = useMutation({
 mutationFn: (formData) => authService.login(formData),
 onSuccess: (response) => {
 login();
 const token = response.data?.token;
 const decodedToken = jwtDecode(token);
 const id = decodedToken.id;
 const role = decodedToken.role;
 const email = decodedToken.email;
 setUser({id, role, email});

 queryClient.invalidateQueries({ queryKey: authKeys.profile() });
 },
 onError: (error) => {
 console.error("Login failed:", error);
 }
});

 const {mutate: logoutMutation, isPending: isLogoutPending} = useMutation({
 mutationFn: () => authService.logout(),
 onSuccess: () => {
 useAuthStore.getState().logout();
 queryClient.invalidateQueries({ queryKey: authKeys.profile() });
 useUserStore.getState().clearUser();
 },
 onError: (error) => {
 console.error("Logout failed:", error);
 }
 });

 return { loginMutation, isLoginPending, logoutMutation, isLogoutPending };
};