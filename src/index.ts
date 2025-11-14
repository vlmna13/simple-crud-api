import dotenv from "dotenv";
import { createServer } from "./server";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
