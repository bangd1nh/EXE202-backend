import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },

  Balance: {
    type: Number,
    default: 0, 
  },

  Transactions: [
    {
      BookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
      Type: {
        type: String,
        enum: ["DEPOSIT", "FINAL", "TRANSFER", "WITHDRAW"],
        required: true,
      },
      Amount: {
        type: Number,
        required: true,
      },
      Timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ]
});

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
