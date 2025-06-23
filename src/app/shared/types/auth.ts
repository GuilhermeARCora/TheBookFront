export interface AuthUser {
  email: string
};
export interface LoginPayload {
  email:string,
  senha:string
};
export interface RegisterPayload {
  email:string,
  senha:string,
  confirmeSenha?:string,
  confirmeEmail?:string
};

export interface LoginResponse {
  token: string
};

export interface RegisterResponse {
  user : AuthUser
};
