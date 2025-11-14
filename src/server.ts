import http, { IncomingMessage, ServerResponse } from "http";
import { UserService } from "./services/userService";
import { User } from "./types/user.js";
import { v4 as randomUUID, validate as validateUUID } from "uuid";
import { parseBody } from "./parseBody";
import { userServiceInstance as userService } from "./services/userService";

function sendJSON(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export const createServer = () => {
  return http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const { method, url } = req;
        if (!url) return sendJSON(res, 404, { message: "Route not found" });

        const parts = url.split("/").filter(Boolean);
        if (parts[0] !== "api" || parts[1] !== "users") {
          return sendJSON(res, 404, { message: "Route not found" });
        }

        const userId = parts[2];

        if (method === "GET" && parts.length === 2) {
          return sendJSON(res, 200, userService.getAll());
        }

        if (method === "GET" && userId) {
          if (!validateUUID(userId)) {
            return sendJSON(res, 400, { message: "Invalid user ID" });
          }

          const user = userService.getById(userId);
          return user
            ? sendJSON(res, 200, user)
            : sendJSON(res, 404, { message: "User not found" });
        }

        if (method === "POST" && parts.length === 2) {
          const body = await parseBody(req);
          const { username, age, hobbies } = body;

          if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
            return sendJSON(res, 400, { message: "Missing or invalid fields" });
          }

          const newUser = userService.create({ username, age, hobbies });
          return sendJSON(res, 201, newUser);
        }

        if (method === "PUT" && userId) {
          if (!validateUUID(userId)) {
            return sendJSON(res, 400, { message: "Invalid user ID" });
          }

          const existingUser = userService.getById(userId);
          if (!existingUser) {
            return sendJSON(res, 404, { message: "User not found" });
          }

          const body = await parseBody(req);
          const updated = userService.update(userId, body);
          return sendJSON(res, 200, updated);
        }

        if (method === "DELETE" && userId) {
          if (!validateUUID(userId)) {
            return sendJSON(res, 400, { message: "Invalid user ID" });
          }

          const deleted = userService.delete(userId);
          return deleted
            ? sendJSON(res, 204, {})
            : sendJSON(res, 404, { message: "User not found" });
        }

        sendJSON(res, 404, { message: "Route not found" });
      } catch (err) {
        console.error("Server error:", err);
        sendJSON(res, 500, { message: "Internal server error" });
      }
    }
  );
};
