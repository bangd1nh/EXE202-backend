import BookingRepository from "../../repositories/booking.repo.js";
import {uploadImageWatermark} from "../../config/cloudinary.js"
import { updateWalletWithTransaction } from "../../repositories/wallet.repo.js";

const rejectBooking = async (bookingId) => {
  const booking = await BookingRepository.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.Status !== "PENDING") {
    throw new Error("Cannot reject a booking that is not PENDING");
  }

  return await BookingRepository.updateStatus(bookingId, "REJECT");
};

const uploadDemo = async (bookingId, files, driveLink) => {
    if(!files || files.length === 0) throw new Error('No files uploaded.');

    const demoPhotos = [];
    for(const file of files) {
        const url = await uploadImageWatermark(file.buffer);
        demoPhotos.push(url);
    }
    return await BookingRepository.updateDemo(bookingId,demoPhotos,driveLink);
}
const acceptFinalPayment = async (bookingId, customerId) => {
  const booking = await BookingRepository.findById(bookingId);
  console.log({booking});

  if (!booking) throw new Error("Booking not found");
  // if (!booking.CustomerId.equals(booking.customerId)) throw new Error("Not your booking");
  if (booking.FinalPaid) throw new Error("Already paid");

  const finalAmount = booking.RemainingAmount;  // Số tiền còn lại
  const totalAmount = booking.DepositAmount + finalAmount;  // Tổng số tiền

  // ghi nhận thanh toán còn lại vào ví admin
  await updateWalletWithTransaction(process.env.ADMIN_USER_ID, {
    BookingId: bookingId,
    Type: "FINAL",  
    Amount: finalAmount,
  });

  // trả 100% số tiền vào ví nhiếp ảnh gia
  await updateWalletWithTransaction(customerId, {
    BookingId: bookingId,
    Type: "TRANSFER",  
    Amount: totalAmount,
  });

  // trừ tiền từ ví admin sau khi chuyển cho nhiếp ảnh gia
  await updateWalletWithTransaction(process.env.ADMIN_USER_ID, {
    BookingId: bookingId,
    Type: "TRANSFER",  
    Amount: totalAmount,
  });

  // cập nhật status booking thành "COMPLTED"
  return BookingRepository.markFinalPaid(bookingId);
};


export default {
  rejectBooking,
  uploadDemo,
  acceptFinalPayment
};
