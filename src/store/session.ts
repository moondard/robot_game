export interface User {
  email: string;
  isGuest: boolean;
}

// Заглушка: текущий пользователь в памяти
let currentUser: User | null = null;

export function setUser(user: User | null) {
  currentUser = user;
}

export function getUser(): User | null {
  return currentUser;
}