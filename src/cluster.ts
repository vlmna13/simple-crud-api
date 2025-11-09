import cluster from "cluster";
import { cpus } from "os";
import http from "http";
import dotenv from "dotenv";
import { createServer } from "./server";
import { User } from "./types/user";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = cpus().length - 1;
let users: User[] = [];

if (cluster.isPrimary) {
  console.log(`🧠 Primary ${process.pid} is running`);
  console.log(`🚀 Starting ${numCPUs} workers...`);

  const workerPorts = Array.from({ length: numCPUs }, (_, i) => PORT + i + 1);

  workerPorts.forEach((port) => {
    const worker = cluster.fork({ PORT: port });

    worker.send({ type: "sync", users });
  });

  let currentWorker = 0;

  const loadBalancer = http.createServer((req, res) => {
    const targetPort = workerPorts[currentWorker];
    currentWorker = (currentWorker + 1) % workerPorts.length;

    const options = {
      hostname: "localhost",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (err) => {
      console.error("Balancer error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Balancer internal error" }));
    });

    req.pipe(proxyReq, { end: true });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`⚖️ Load balancer listening on http://localhost:${PORT}`);
    console.log(`💡 Workers: ${workerPorts.join(", ")}`);
  });

  for (const id in cluster.workers) {
    cluster.workers[id]?.on("message", (msg) => {
      if (msg.type === "update") {
        users = msg.users;

        for (const wid in cluster.workers) {
          cluster.workers[wid]?.send({ type: "sync", users });
        }
      }
    });
  }

  cluster.on("exit", (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died`);
  });
} else {
  const workerPort = Number(process.env.PORT);
  const server = createServer();

  import("./services/userService").then(({ userServiceInstance }) => {
    process.on("message", (msg: any) => {
      if (msg.type === "sync" && Array.isArray(msg.users)) {
        userServiceInstance.setUsers(msg.users);
      }
    });

    userServiceInstance.onChange((users: User[]) => {
      process.send?.({ type: "update", users });
    });

    server.listen(workerPort, () => {
      console.log(`⚙️ Worker ${process.pid} started on port ${workerPort}`);
    });
  });
}

