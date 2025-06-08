import Wallet from "../models/Wallet.js";

export const updateWalletWithTransaction = async (userId, transaction) => {
  let balanceChange = 0;

  // Xử lý các loại giao dịch khác nhau
  switch (transaction.Type) {
    case "DEPOSIT":    // khi có tiền nạp vào ví
    case "FINAL":      // thanh toán số còn lại 
      balanceChange = transaction.Amount; // Cộng tiền vào ví
      break;
    case "TRANSFER":   // khi chuyển tiền từ ví admin vào ví nhiếp ảnh gia
      if (userId === process.env.ADMIN_USER_ID) {
        balanceChange = -transaction.Amount; // trừ tiền từ ví admin
      } else {
        balanceChange = transaction.Amount; // cộng tiền vào ví nhiếp ảnh gia
      }
      break;
    case "WITHDRAW":   // khi rút tiền
      balanceChange = -transaction.Amount; // trừ tiền khỏi ví
      break;
    default:
      throw new Error("Invalid transaction type");
  }

  const wallet = await Wallet.findOneAndUpdate(
    { UserId: userId },
    {
      $inc: { Balance: balanceChange },  // cập nhật ví
      $push: { Transactions: transaction },  // lưu giao dịch
    },
    { new: true, upsert: true } // tạo ví nếu chưa tồn tại
  );

  return wallet;
};

export const findWalletByUserId = async (userId) => {
  return await Wallet.findOne({ UserId: userId });
};


