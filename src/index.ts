import app from "./app";
import { cronService } from "./services";
import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   //start email reminder cron service
//   cronService.sendEmailReminders();

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
// } else {
// Code to run the Express app in each worker
app.listen(app.get("config").port, () => {
  console.log(
    `Worker ${process.pid} started, listening on port ${app.get("config").port}`
  );
});
// }
