import User from "../../models/User.js";

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return dataResponse(404, "not found user", null);
    }
    return dataResponse(200, "found user", user);
};
