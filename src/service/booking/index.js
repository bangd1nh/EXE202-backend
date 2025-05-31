import Booking from "../../models/Booking.js";
import PhotographerProfile from "../../models/PhotographerProfile.js";
import User from "../../models/User.js";

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getPhotographerUsername = async (userId) => {
    const user = await PhotographerProfile.findById(userId).populate(
        "PhotographerId"
    );
    if (!user) {
        return dataResponse(404, "not found", null);
    }
    const userName = user.PhotographerId.Username;
    return dataResponse(200, "found", userName);
};

export const getUserInfomation = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "found", user);
};

export const getCustomerIdByEmail = async (email) => {
    const user = await User.findOne({
        Email: email,
    });
    return dataResponse(200, "found", user);
};

export const handleBookingForPhotographer = async (
    customerId,
    photographerId,
    serviceId,
    bookingDate,
    time,
    message,
    location
) => {
    const booking = Booking.create({
        CustomerId: customerId,
        PhotographerId: photographerId,
        ServiceId: serviceId,
        BookingDate: bookingDate,
        Time: time,
        Message: message,
        BookingType: "Photographer",
        Status: "PENDING",
        Location: location,
    });
    if (!booking) {
        return dataResponse(400, "idk", null);
    }
    return dataResponse(200, "success", booking);
};

export const getPendingBookingByPhotographerId = async (photographerId) => {
    const photographer = await PhotographerProfile.findOne({
        PhotographerId: photographerId,
    });
    const bookings = await Booking.find({
        PhotographerId: photographer._id,
        Status: "PENDING",
    })
        .populate("CustomerId", "-Password")
        .populate("ServiceId");
    return dataResponse(200, "success", bookings);
};

export const acceptBooking = async (bookingId, status) => {
    const booking = await Booking.findByIdAndUpdate(bookingId, {
        Status: status,
    });
    if (!booking) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "sucess", booking);
};

export const getAcceptedBooking = async (photographerId) => {
    const photographer = await PhotographerProfile.findOne({
        PhotographerId: photographerId,
    });
    const bookings = await Booking.find({
        PhotographerId: photographer._id,
        Status: "ACCEPT",
    })
        .populate("CustomerId", "-Password")
        .populate("ServiceId");
    return dataResponse(200, "success", bookings);
};

export const getCustomerBooking = async (customerId) => {
    const bookings = await Booking.find({
        CustomerId: customerId,
    })
        .populate("CustomerId")
        .populate({
            path: "PhotographerId",
            populate: {
                path: "PhotographerId",
            },
        })
        .populate("ServiceId");
    return dataResponse(200, "sucess", bookings);
};
