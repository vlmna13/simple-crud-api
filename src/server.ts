import http, { IncomingMessage, ServerResponse } from "http";
import { UserService } from "./services/userService";
import { User } from "./types/user.js";
import { v4 as randomUUID, validate as validateUUID } from "uuid";
import { parseBody } from "./parseBody";

const userService = new UserService();

export const createServer = () => {
  const server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      const { method, url } = req;
      if (!url) return;
      if (!url.startsWith("/api/users")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
        return;
      }

      const parts = url.split("/").filter(Boolean);
      const userId = parts[2];

      try {
        if (method === "GET" && parts.length === 2) {
          const users = userService.getAll();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(users));
          return;
        }
        if (method === "GET" && parts.length === 3) {
          if (!validateUUID(userId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid user ID" }));
            return;
          }
          const user = userService.getById(userId);
          if (!user) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(user));
          return;
        }
        if (method === "POST" && parts.length === 2) {
          const body = await parseBody(req);
          const { username, age, hobbies } = body;

          if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Missing or invalid fields" }));
            return;
          }

          const newUser = userService.create({ username, age, hobbies });
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
          return;
        }

        if (method === "PUT" && parts.length === 3) {
          if (!validateUUID(userId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid user ID" }));
            return;
          }

          const user = userService.getById(userId);
          if (!user) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
          }

          const body = await parseBody(req);
          const updated = userService.update(userId, body);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(updated));
          return;
        }

        if (method === "DELETE" && parts.length === 3) {
          if (!validateUUID(userId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid user ID" }));
            return;
          }

          const deleted = userService.delete(userId);
          if (!deleted) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
          }

          res.writeHead(204);
          res.end();
          return;
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      } catch (err) {
        console.error("Server error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      }
    }
  );

  return server;
};
