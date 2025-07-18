import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SignupInput } from "@/lib/auth-utils";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface SignupResponse {
  message: string;
  userId: string;
}

interface ApiError {
  error: string;
  details?: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
}

export function useSignUp() {
  return useMutation<SignupResponse, ApiError, SignupInput>({
    mutationFn: async (data: SignupInput) => {
      try {
        const response = await api.post("/auth/signup", data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw error.response.data;
        }
        throw { error: "Network Error Occoured" };
      }
    },
  });
}
