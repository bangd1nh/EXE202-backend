import express from "express";
import BookingController from "../controller/booking.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.patch("/:id/reject", BookingController.rejectBooking); 
router.patch("/:id/demo", upload.array("files"), BookingController.uploadDemo); 
router.patch("/:id/final-accept", BookingController.acceptFinalPayment); 


export default router;
