import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Avatar: String,
    Email: { type: String, required: true },
    FirstName: String,
    LastName: String,
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    PhoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return /^0\d{9}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    Role: {
        type: String,
        enum: ["CUSTOMER", "PHOTOGRAPHER", "ADMIN"],
        required: true,
    },
    CreateAt: {
        type: Date,
        default: Date.now(),
    },
    verify: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
