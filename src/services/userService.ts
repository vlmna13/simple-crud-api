import { randomUUID } from "crypto";
import { User } from "../types/user";

export class UserService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(data: Omit<User, "id">): User {
    const newUser: User = {
      id: randomUUID(),
      ...data,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, data: Partial<Omit<User, "id">>): User | undefined {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return undefined;

    const updated = { ...this.users[userIndex], ...data };
    this.users[userIndex] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
