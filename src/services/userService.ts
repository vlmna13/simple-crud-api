import { randomUUID } from "crypto";
import { User } from "../types/user";

import { EventEmitter } from "events";

export class UserService extends EventEmitter {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(data: Omit<User, "id">): User {
    const newUser: User = { id: randomUUID(), ...data };
    this.users.push(newUser);
    this.emit("change");
    return newUser;
  }

  update(id: string, data: Partial<Omit<User, "id">>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    this.users[index] = { ...this.users[index], ...data };
    this.emit("change");
    return this.users[index];
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    this.emit("change");
    return true;
  }

  setUsers(newUsers: User[]): void {
    this.users = newUsers;
  }

  onChange(callback: (users: User[]) => void): void {
    this.on("change", () => callback(this.users));
  }
}

export const userServiceInstance = new UserService();
