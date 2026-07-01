import api from "@/app/lib/api";
import { AUTH_ENDPOINTS } from "@/app/lib/constants";
import type { User } from "@/app/types/user";

export const authService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>(AUTH_ENDPOINTS.me);
    return data;
  },

  login(): void {
    window.location.href = AUTH_ENDPOINTS.login;
  },

  async logout(): Promise<void> {
    await api.post(AUTH_ENDPOINTS.logout);
  },

  installGitHubApp(): void {
    window.location.href = AUTH_ENDPOINTS.install;
  },
};
