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

  login: async (data: RegisterRequest) => {
    try {
      const response = await fetcher.get<RegisterResponse[]>('/Auth');

      const user = response.data.find(u => u.email === data.email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const accessToken = `mock-token-${user.id}-${Date.now()}`;

      return {
        user,
        accessToken,
      };
    } catch (error) {
      console.log('Login error:', error);
      throw new Error('Login failed. Please try again.');
    }
  },
};
