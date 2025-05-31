import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    PhotographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photographer",
        required: false,
    },
    ServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
    },
    BookingType: {
        type: String,
        enum: ["Customer", "Photographer"],
        required: true,
    },
    BookingDate: {
        type: Date,
        require: true,
    },
    Time: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        required: true,
    },
    CreateAt: {
        type: Date,
        default: Date.now(),
    },
    Message: String,
    Status: {
        type: String,
        enum: ["PENDING", "REJECT", "ACCEPT", "PROCESSING", "DONE"],
    },
    ResourceId: {
        type: String,
        require: false,
    },
    Location: String,
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
