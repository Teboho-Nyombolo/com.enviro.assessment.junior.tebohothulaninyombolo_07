export interface Investor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}
