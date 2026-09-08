import { useMutation } from "@tanstack/react-query";
import { registerUser } from "./authApi";
export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
        onsuccess: (data) => {
            console.log("User registered successfully:", data);
        },
        onError: (error) => {
            console.error("Error registering user:", error);
        }
    })
}