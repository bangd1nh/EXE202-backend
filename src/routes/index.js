import express from "express";
import authentication from "../controller/authenticaiton.js";
import photographers from "../controller/photographers.js";
import user from "../controller/user.js";
import photographs from "../controller/photographs.js";
import booking from "../controller/booking.js";
import bookingRoutes from "../routes/booking.routes.js";
import walletRoutes from "../routes/wallet.routes.js";
import blogRoutes from "../routes/blog.routes.js";
import gallery from "../controller/gallery.js";

const router = express.Router();

router.use("/authenticate", authentication);
router.use("/photographers", photographers);
router.use("/user", user);
router.use("/phtographs", photographs);
router.use("/booking", booking);
router.use("/bookings", bookingRoutes);
router.use("/wallets", walletRoutes);
router.use("/blogs", blogRoutes);
router.use("/galery", gallery);

export default router;
