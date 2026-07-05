import app from "./app";
//import config from "./config";
// import { prisma } from "./lib/prisma";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";

const PORT = config.port || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connect to the database successfully.");
    app.listen(PORT, () => {
      console.log(`server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
