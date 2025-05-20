import Token from "../../models/Token.js";
import User from "../../models/User.js";
import { generateToken, hashPassword, sendEmail } from "../../utils/index.js";
import bcrypt from "bcrypt";

const dataResponse = (message, code, payload) => {
    return {
        message,
        code,
        payload,
    };
};

export const accountRegister = async (email, password, role) => {
    try {
        const user = await User.exists({ Email: email });
        if (user) {
            return dataResponse("email already exists", 200, null);
        }
        const passwordHash = await hashPassword(password);
        const createdUser = await User.create({
            Email: email,
            Username: email,
            Password: passwordHash,
            Role: role,
        });
        return dataResponse("user create successfully", 200, createdUser);
    } catch (error) {
        return dataResponse(`server error: ${error}`, 500, null);
    }
};

export const createToken = async (userId) => {
    try {
        const token = generateToken();
        const createdToken = await Token.create({
            token: token,
            userId: userId,
            type: "verify",
        });
        return dataResponse("token created", 201, createdToken);
    } catch (error) {
        return dataResponse(`server error ${error}`, 500, null);
    }
};

export const sendToken = async (email, token) => {
    try {
        const sent = await sendEmail(
            email,
            "Please verify your email",
            `http://localhost:3000/api/authenticate/verify/${token}`
        );
        return dataResponse("Please verify your email", 200, sent);
    } catch (error) {
        return dataResponse(error, 500, null);
    }
};

export const verifyToken = async (token) => {
    try {
        const result = await Token.findOneAndDelete({ token: token });
        if (!result) {
            return dataResponse("this token is no longer exist", 404, null);
        }
    } catch (error) {}
};

export const login = async (usernameOrEmail, password) => {
    try {
        const user = await User.findOne({
            $or: [{ Email: usernameOrEmail }, { Username: usernameOrEmail }],
        });
        console.log(user);
        if (!user) {
            return dataResponse("this user does not exist", 404, null);
        }
        const result = await bcrypt.compare(password, user.Password);
        if (result) {
            return dataResponse("login successfully", 200, user);
        } else {
            return dataResponse("wrong password", 400, null);
        }
    } catch (error) {
        return dataResponse(`sever error ${error}`, 500, null);
    }
};
