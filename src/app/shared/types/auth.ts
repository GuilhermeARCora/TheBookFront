export interface LoginPayload {
  username:string,
  senha:string
};
export interface RegisterPayload {
  nome:string,
  documento:string,
  email:string,
  senha:string,
  confirmaSenha:string
};

export interface LoginResponse {
  access_token: string
};

export interface GetUserNameResponse {
  nome: string
};

