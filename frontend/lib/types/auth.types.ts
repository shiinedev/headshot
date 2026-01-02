import { User } from "./user.types";


export interface RegisterInput{
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse{
  user:User
}

export interface LoginInput{
    email: string;
    password: string;
}
export interface LoginResponse{
  user:User,
  token:string
}