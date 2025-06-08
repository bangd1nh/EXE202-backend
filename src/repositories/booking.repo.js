import Booking from "../models/Booking.js"

const findById = async (id) => {
  return await Booking.findById(id);
};
const updateStatus = async (id, status) => {
    return await Booking.findByIdAndUpdate(
        id,
        {Status: status},
        {new: true}
    );
};

const updateDemo = async (bookingId, demoPhotos, driveLink) => {
    const booking = await Booking.findOneAndUpdate(
        {_id: bookingId},
        {
            $push: { DemoPhotos: { $each: demoPhotos } },
            DriveLink: driveLink,
            Status: 'WAITING_DEMO',
        },
        {new: true}
    );
    if(!booking) throw new Error('Booking not found!');
    return booking;
};
const markFinalPaid = async (id) => {
  return Booking.findByIdAndUpdate(
    id,
    {
      FinalPaid: true,
      FinalPaidAt: new Date(),
      Status: "DONE",
    },
    { new: true }
  );
};

export default {findById, updateStatus, updateDemo, markFinalPaid};