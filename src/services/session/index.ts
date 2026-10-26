import type { IUser } from "../../interfaces/User";

// Заглушка: текущий пользователь в памяти
let currentUser: IUser | null = null;

export function setUser(user: IUser | null) {
  currentUser = user;
}

export function getUser(): IUser | null {
  return currentUser;
}