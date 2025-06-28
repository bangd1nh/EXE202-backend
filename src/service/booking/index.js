import Booking from "../../models/Booking.js";
import PhotographerProfile from "../../models/PhotographerProfile.js";
import User from "../../models/User.js";
import nodemailer from "nodemailer";
import { sendEmail, sendEmailHtml } from "../../utils/index.js";
import Services from "../../models/Services.js";
import { updateWalletWithTransaction } from "../../repositories/wallet.repo.js";

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
    const service = await Services.findById(serviceId);
    if (!service) throw new Error("Service not found");

    const total = service.Price;
    const deposit = Math.round(total * 0.3);
    const remaining = Math.round(total * 0.7);

    const booking = await Booking.create({
        CustomerId: customerId,
        PhotographerId: photographerId,
        ServiceId: serviceId,
        BookingDate: bookingDate,
        Time: time,
        Message: message,
        BookingType: "Photographer",
        Status: "PENDING",
        Location: location,
        DepositAmount: deposit,
        RemainingAmount: remaining,
        DepositPaid: true,
        DepositPaidAt: new Date(),
    });
    if (!booking) {
        return dataResponse(400, "idk", null);
    }
    
    await updateWalletWithTransaction(process.env.ADMIN_USER_ID,{
            BookingId: booking._id,
            Type: 'DEPOSIT',
            Amount: deposit,
        });

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
         Status: { $in: ["ACCEPT", "WAITING_DEMO"] },
    })
        .populate("CustomerId", "-Password")
        .populate("ServiceId");
    return dataResponse(200, "success", bookings);
};

export const getCustomerBooking = async (customerId) => { /////
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

export const sendBookingEmail = async (
    email,
    service,
    location,
    time,
    date
) => {
    try {
        console.log(email, service, location, time, date);
        const serviceName = await Services.findById(service);
        const sent = await sendEmailHtml(
            email,
            "Cảm ơn bạn đã sử dụng dịch vụ của Framate",
            generateEmailTemplate({
                customerName: email,
                amount: 500000,
                service: serviceName.Name,
                photographer: "Nguyen Bang",
                location: location,
                time: time,
                date: date,
            })
        );
        return dataResponse(200, "success", sent);
    } catch (err) {
        return dataResponse(500, err, null);
    }
};

function generateEmailTemplate({
    customerName,
    amount,
    service,
    photographer,
    location,
    time,
    date,
}) {
    return `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4B0082;">Cảm ơn bạn đã sử dụng dịch vụ của <strong>FrameMate</strong>!</h2>
    
    <p>Chào <strong>${customerName}</strong>,</p>
    <p>Chúng tôi xin xác nhận rằng bạn đã đặt cọc thành công số tiền <strong style="color: #008000;">${amount} VND</strong> cho dịch vụ <strong>${service}</strong>.</p>

    <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #4B0082;">
      <p><strong>Thông tin đặt dịch vụ:</strong></p>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Nhiếp ảnh gia:</strong> ${photographer}</li>
        <li><strong>Địa điểm:</strong> ${location}</li>
        <li><strong>Thời gian:</strong> ${time}</li>
        <li><strong>Ngày:</strong> ${date}</li>
      </ul>
    </div>

    <p>Nếu có bất kỳ câu hỏi nào, bạn có thể liên hệ với chúng tôi qua email hoặc hotline.</p>

    <p>Trân trọng,<br/>Đội ngũ FrameMate</p>

    <hr style="margin-top: 30px;"/>
    <p style="font-size: 12px; color: #888;">Email này được gửi tự động, vui lòng không trả lời.</p>
  </div>
  `;
}
