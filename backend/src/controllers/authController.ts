import { AuthService } from "../services";
import type { AuthResponse, SafeUser } from "../types";

const authService = new AuthService();

export class AuthController {
  async register(body: {
    email: string;
    password: string;
    fullName?: string;
  }): Promise<AuthResponse> {
    return await authService.register(body);
  }

  async login(body: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return await authService.login(body);
  }

  async getMe(userId: string): Promise<{ user: SafeUser }> {
    const user = await authService.getProfile(userId);
    return { user };
  }

  async updateProfile(
    userId: string,
    body: { fullName?: string; avatarUrl?: string }
  ): Promise<{ message: string; user: SafeUser }> {
    const user = await authService.updateProfile(userId, body);
    return {
      message: "Profile updated successfully",
      user,
    };
  }
}
