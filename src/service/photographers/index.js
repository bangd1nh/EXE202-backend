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

export const getPhotographerProfileByUserId = async (userId) => {
    const userProfile = await PhotographerProfile.findOne({
        PhotographerId: userId,
    })
        .populate("PhotoGraphs")
        .populate("Services");
    if (!userProfile) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "success", userProfile);
};

export const updatePhotographerProfile = async (
    userId,
    expY,
    location,
    device,
    description
) => {
    const userProfile = await PhotographerProfile.findOneAndUpdate(
        {
            PhotographerId: userId,
        },
        {
            ExperienceYear: expY,
            Location: location,
            Device: device,
            Description: description,
        },
        { new: true }
    );
    if (!userProfile) {
        return dataResponse(404, "not found user", null);
    }
    return dataResponse(200, "success", userProfile);
};
