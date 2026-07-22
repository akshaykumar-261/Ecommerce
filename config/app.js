import { sequelize } from "./db.js";
import { serverFile } from "../src/helper/commanMessages.js";
const startServer = (server) => {
  const envPort = process.env.PORT || 8085;
  sequelize
    .authenticate()
    .then(() => {
      console.log(serverFile.DB_CONNECTION);
      const start = server.listen(envPort, () => {
        console.log(serverFile.RUNNING_PORT, `${envPort}`);
      });
      start.on("error", () => {
        console.log(serverFile.SERVER_ERROR);
        console.error(error);
      });
    })
    .catch((error) => {
      console.error(serverFile.ERROR);
      console.error(error);
    });
  process.on("SIGINT", () => {
    sequelize
      .close()
      .then(() => {
        console.log(startServer.DB_CLOSE);
        process.exit(0);
      })
      .catch(() => {
        console.log(startServer.DB_CLOSING_ERROR, error.message);
      });
  });
};
export default startServer;
