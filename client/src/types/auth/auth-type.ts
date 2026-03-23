export type UserRole = 'USER' | 'MANAGER' | 'ADMIN';

export type USER_DATA = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};
