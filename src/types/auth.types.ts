export interface CreateUserParams {
  email: string;
  password: string;
  userAgent?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  userAgent?: string;
}
