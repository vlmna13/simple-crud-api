import http from "http";

export function createServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const { method, url } = req;
      if (method === "GET" && url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server is running" }));
        return;
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
      console.error("Server error:", error);
    }
  });

  return server;
}
