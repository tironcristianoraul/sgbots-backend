import chalk from "chalk";
import config from "../config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mainRouter from "../router";
import cookieParser from "cookie-parser";
import customLogger from "../utils/request_logger";
import { RateLimiterMemory } from "rate-limiter-flexible";

const createServer = () => {
  const router = express();

  router.use(cors({ origin: true }));

  // Additional headers
  router.use(helmet());

  router.use(express.json({ limit: "100mb" }));
  router.use(express.urlencoded({ limit: "100mb", extended: true }));
  router.use(cookieParser());

  // disable x-powered-by for anti-tracking
  router.disable("x-powered-by");

  if (config.server.mode === "testing") {
    router.use(customLogger());
  }

  // Rate Limiter
  const rateLimiter = new RateLimiterMemory({
    points: 120,
    duration: 60,
  });

  router.use((req, res, next) => {
    const ip = req.ip || "127.0.0.1";
    rateLimiter
      .consume(ip)
      .then(() => next())
      .catch(() => {
        res.status(429).json({ error: "Too many requests! Try again later!" });
      });
  });

  router.use("/sgbots/api", mainRouter);

  router.listen(config.server.port, "0.0.0.0", () => {
    console.log(
      chalk`🚀 {rgb(0,0,255) SGBots Website backend is listening on port ${
        config.server.port
      }.} {rgb(255, 10, 120) [${new Date().toDateString()}]} 🌲!`
    );
  });
};

export default createServer;
