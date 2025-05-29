import PhotographerProfile from "../../models/PhotographerProfile.js";

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getAllPhotographers = async () => {
    const photographers = await PhotographerProfile.find()
        .populate(
            "PhotographerId",
            "Email FirstName LastName PhoneNumber Avatar Username"
        )
        .populate("PhotoGraphs");
    return dataResponse(200, "success", photographers);
};

export const getServiceByPhotographersId = async (photographerId) => {
    const service = await PhotographerProfile.findById(photographerId)
        .select("Services -_id")
        .populate("Services");
    if (!service) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "found", service);
};
