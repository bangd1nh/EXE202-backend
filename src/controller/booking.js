import express from "express";
import asyncHandler from "../middleware/index.js"; 

import {
    acceptBooking,
    getAcceptedBooking,
    getCustomerBooking,
    getCustomerIdByEmail,
    getPendingBookingByPhotographerId,
    getPhotographerUsername,
    getUserInfomation,
    handleBookingForPhotographer,
    sendBookingEmail,
} from "../service/booking/index.js";

const booking = express.Router();

booking.get("/photographer/:photographerId", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPhotographerUsername(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

booking.get("/customer/:userId", asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await getUserInfomation(userId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

booking.post("/book/photographer/:photographerId", asyncHandler(async (req, res) => {
    const { email, location, service, message, date, time } = req.body;
    const { photographerId } = req.params;

    const result = await getCustomerIdByEmail(email);
    const customerId = result.payload._id;

    await handleBookingForPhotographer(
        customerId,
        photographerId,
        service,
        date,
        time,
        message,
        location
    );

    const resultMail = await sendBookingEmail(
        email,
        service,
        location,
        time,
        date
    );

    res.status(resultMail.code).json({
        message: resultMail.message,
        payload: resultMail.payload,
    });
}));

booking.get("/book/:photographerId", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPendingBookingByPhotographerId(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

booking.get("/book/accept/:bookingId", asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const result = await acceptBooking(bookingId, "ACCEPT");
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

booking.get("/book/acceptList/:photographerId", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const result = await getAcceptedBooking(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

booking.get("/book/customer/:customerId", asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const result = await getCustomerBooking(customerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

export default booking;
