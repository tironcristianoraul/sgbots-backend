import { str, cleanEnv, port, url } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  DATABASE,
  MODE,
  // SUPERADMINS,
} = cleanEnv(process.env, {
  PORT: port(),
  DATABASE: url(),
  MODE: str({ choices: ["testing", "production"] }),
  // SUPERADMINS: str(),
});

const env = {
  server: {
    port: PORT,
    database:
      MODE === "testing"
        ? `${DATABASE}/dev?retryWrites=true&w=majority&appName=Cluster0`
        : `${DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,
    mode: MODE,
    url:
      MODE === "testing"
        ? `http://127.0.0.1:${PORT}`
        : `https://sgbots-backend.onrender.com`,
    // superadmins: SUPERADMINS.split("|"),
  },
};

export default env;
