import apiClient from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addresses?: any[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AddAddressRequest {
  addressType: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/api/auth/me');
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<{ success: boolean; data: UserProfile }>(
      '/api/auth/update-profile',
      data
    );
    return response.data.data;
  }

  /**
   * Update password
   */
  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await apiClient.put('/api/auth/update-password', data);
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', { email });
  }

  /**
   * Reset password
   */
  async resetPassword(resetToken: string, password: string): Promise<void> {
    await apiClient.put(`/api/auth/reset-password/${resetToken}`, { password });
  }

  /**
   * Add new address
   */
  async addAddress(address: AddAddressRequest): Promise<UserProfile> {
    const response = await apiClient.post<{ success: boolean; data: UserProfile }>(
      '/api/auth/address',
      address
    );
    return response.data.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<UserProfile> {
    const response = await apiClient.delete<{ success: boolean; data: UserProfile }>(
      `/api/auth/address/${addressId}`
    );
    return response.data.data;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_session');
  }
}

export default new AuthService();
