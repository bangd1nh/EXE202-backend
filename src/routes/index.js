import express from "express";
import authentication from "../controller/authenticaiton.js";

const router = express.Router();

router.use("/api/authenticate", authentication);

export default router;
