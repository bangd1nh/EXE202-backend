import express from "express";
import {
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

export default booking;
