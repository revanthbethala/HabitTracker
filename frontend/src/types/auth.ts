export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: User;
  };
}
