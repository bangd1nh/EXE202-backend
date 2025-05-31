import express from "express";
import {
    acceptBooking,
    getAcceptedBooking,
    getCustomerBooking,
    getCustomerIdByEmail,
    getPendingBookingByPhotographerId,
    getPhotographerUsername,
    getUserInfomation,
    handleBookingForPhotographer,
} from "../service/booking/index.js";

const booking = express.Router();

booking.get("/photographer/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPhotographerUsername(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/customer/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await getUserInfomation(userId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.post("/book/photographer/:photographerId", async (req, res) => {
    const { email, location, service, message, date, time } = req.body;
    const { photographerId } = req.params;
    const result = await getCustomerIdByEmail(email);
    console.log(result);
    const customerId = result.payload._id;
    const result1 = await handleBookingForPhotographer(
        customerId,
        photographerId,
        service,
        date,
        time,
        message,
        location
    );
    res.status(result1.code).json({
        message: result1.message,
        payload: result1.payload,
    });
});

booking.get("/book/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPendingBookingByPhotographerId(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/book/accept/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    const result = await acceptBooking(bookingId, "ACCEPT");
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/book/reject/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    const result = await acceptBooking(bookingId, "REJECT");
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/book/acceptList/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getAcceptedBooking(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/book/done/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    const result = await acceptBooking(bookingId, "DONE");
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

booking.get("/book/customer/:customerId", async (req, res) => {
    const { customerId } = req.params;
    const result = await getCustomerBooking(customerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

export default booking;
