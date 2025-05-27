import PhotographerProfile from "../../models/PhotographerProfile.js";

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getAllPhotographers = async () => {
    const photographers = await PhotographerProfile.find();
    return dataResponse(200, "success", photographers);
};
