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
    enum: ["PENDING", "REJECT", "ACCEPT", "WAITING_DEMO", "DONE"],
  },
  Location: String,

  DepositAmount: {
    type: Number,
    required: true,
  },
  RemainingAmount: {
    type: Number,
    required: true,
  },
  DepositPaid: {
    type: Boolean,
    default: true, 
  },
  FinalPaid: {
    type: Boolean,
    default: false,
  },
  DepositPaidAt: {
    type: Date,
    default: Date.now,
  },
  FinalPaidAt: Date,

  DemoPhotos: {
    type: [String], 
    default: [],
  },
  
  DriveLink: String,
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
