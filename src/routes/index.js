import express from "express";
import authentication from "../controller/authenticaiton.js";
import photographers from "../controller/photographers.js";
import user from "../controller/user.js";
import photographs from "../controller/photographs.js";
import booking from "../controller/booking.js";
import services from "../controller/services.js";

const router = express.Router();

router.use("/api/authenticate", authentication);
router.use("/api/photographers", photographers);
router.use("/api/user", user);
router.use("/api/phtographs", photographs);
router.use("/api/booking", booking);
router.use("/api/services", services);

export default router;
