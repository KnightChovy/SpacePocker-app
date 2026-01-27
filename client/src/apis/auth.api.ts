import fetcher from './fetcher';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  createdAt: string;
  accessToken?: string;
}

export interface AuthError {
  message: string;
  error?: string;
}

export const authAPI = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetcher.post<RegisterResponse>('/Auth', data);
    return response.data;
  },

  // MockAPI doesn't support custom endpoints like /login
  // So we'll simulate login by fetching all users and checking credentials
  login: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      // Get all users from MockAPI
      const response = await fetcher.get<RegisterResponse[]>('/Auth');

      // Find user with matching email and password
      const user = response.data.find((u) => u.email === data.email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Generate a mock access token
      const accessToken = `mock-token-${user.id}-${Date.now()}`;

      return {
        ...user,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  },
};
