import cluster from "cluster";
import { cpus } from "os";
import { createServer } from "./server";
import dotenv from "dotenv";

dotenv.config();

const numCPUs = cpus().length - 1;
const PORT = Number(process.env.PORT) || 4000;

if (cluster.isPrimary) {
  console.log(`🧠 Primary ${process.pid} is running`);
  console.log(`🚀 Starting ${numCPUs} workers...`);

  for (let i = 1; i <= numCPUs; i++) {
    cluster.fork({ PORT: PORT + i });
  }

  cluster.on("exit", (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died`);
  });
} else {
  const server = createServer();
  const workerPort = Number(process.env.PORT);
  server.listen(workerPort, () => {
    console.log(`⚙️ Worker ${process.pid} started on port ${workerPort}`);
  });
}
