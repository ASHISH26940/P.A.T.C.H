import axios from "axios";
import { RegisterRequest, LoginRequest, Token, User } from "@/types/api";

const BASE_URL = "http://127.0.0.1:5000";
const DEV_MODE = true;

export const TOKEN_STORAGE_KEY = "jwt_token";

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const serverError = error.response?.data;
    const errorMessage =
      serverError?.detail || error.message || "An unknown API error occurred";
    console.error("Backend API Error:", errorMessage, serverError);
    throw new Error(errorMessage);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred");
}

export async function registerUser(request: RegisterRequest): Promise<User> {
  if (DEV_MODE) {
    return { id: 1, username: request.username, email: request.email || "dev@patch.local" };
  }
  try {
    const response = await axios.post<User>(
      `${BASE_URL}/v1/auth/register`,
      request
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function loginUser(request: LoginRequest): Promise<User> {
  if (DEV_MODE) {
    const user: User = { id: 1, username: request.username, email: "dev@patch.local" };
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, "dev_token");
      localStorage.setItem("dev_user", JSON.stringify(user));
    }
    return user;
  }

  const formData = new URLSearchParams();
  formData.append("username", request.username);
  formData.append("password", request.password);

  try {
    const response = await axios.post<Token>(
      `${BASE_URL}/v1/auth/login`,
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const tokenData = response.data;

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, tokenData.access_token);
    }

    const userData = await getCurrentUser();
    return userData;
  } catch (error) {
    logoutUser();
    handleApiError(error);
  }
}

export async function getCurrentUser(): Promise<User> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  if (DEV_MODE && token === "dev_token") {
    const stored = localStorage.getItem("dev_user");
    if (stored) return JSON.parse(stored);
    throw new Error("Dev user not found.");
  }

  try {
    const response = await axios.get<User>(`${BASE_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logoutUser();
    }
    handleApiError(error);
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
}
