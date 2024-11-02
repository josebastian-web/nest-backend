import { User } from "../entities/user.entity";

export interface LoginRespose {
  user: User;
  token: string;
}