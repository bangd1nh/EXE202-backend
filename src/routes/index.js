import express from "express";
import authentication from "../controller/authenticaiton.js";
import photographers from "../controller/photographers.js";
import user from "../controller/user.js";

const router = express.Router();

router.use("/api/authenticate", authentication);
router.use("/api/photographers", photographers);
router.use("/api/user", user);

export default router;
