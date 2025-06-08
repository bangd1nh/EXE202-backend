import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import connectDB from "../config/database.js";

const migrateBooking = async () => {
  try {
    
    await connectDB();  

    const bookings = await Booking.find({});

    for (let booking of bookings) {
      if (booking.DepositAmount === undefined) {
        booking.DepositAmount = 0; 
      }
      if (booking.RemainingAmount === undefined) {
        booking.RemainingAmount = 0; 
      }

      if (booking.DemoPhotos === undefined) {
        booking.DemoPhotos = [];
      }
      if (booking.DriveLink === undefined) {
        booking.DriveLink = '';
      }
      
      await booking.save();
    }

    console.log("Migration complete!"); 
  } catch (error) {
    console.error("Error during migration:", error);  
  }finally {
    mongoose.disconnect();
  }
};

migrateBooking();
