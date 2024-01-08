import app from "./app";
import config from "./utils/config";
import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

const PORT = config.port || 3000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Code to run the Express app in each worker
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started, listening on port ${PORT}`);
  });
}
