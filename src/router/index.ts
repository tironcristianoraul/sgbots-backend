import express from "express";
import guestRouter from "./guest.routes";

const mainRouter = express.Router();

mainRouter.use("/guest", guestRouter);

export default mainRouter;
