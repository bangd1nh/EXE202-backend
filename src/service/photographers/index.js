import PhotographerProfile from "../../models/PhotographerProfile.js";

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getAllPhotographers = async () => {
    const photographers = await PhotographerProfile.find().populate(
        "PhotographerId",
        "Email FirstName LastName PhoneNumber Avatar Username"
    );
    return dataResponse(200, "success", photographers);
};
