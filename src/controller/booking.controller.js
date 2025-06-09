import ApiResponse from "../utils/apiResponse.js";
import bookingService from "../service/booking/booking.service.js";

const rejectBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const result = await bookingService.rejectBooking(bookingId);
    return ApiResponse.success(res, result);
  } catch (err) {
    return ApiResponse.error(res, 500, err.message);
  }
};

const uploadDemo = async (req, res) => {
  try {
    const { id } = req.params;
    const { driveLink } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      throw new Error("no files uploaded.");
    }
    if (!driveLink) {
      throw new Error("drive link is required.");
    }

    const result = await bookingService.uploadDemo(id, files, driveLink);
    return ApiResponse.success(res, result);
  } catch (err) {
    return ApiResponse.error(res, 500, err.message);
  }
};

const acceptFinalPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId } = req.body;
    console.log({ customerId });
    const result = await bookingService.acceptFinalPayment(id, customerId);
    return ApiResponse.success(res, result);
  } catch (err) {
    return ApiResponse.error(res, 500, err.message);
  }
};

export default {
  rejectBooking,
  uploadDemo,
  acceptFinalPayment,
};
