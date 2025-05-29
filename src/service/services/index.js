import Services from "../../models/Services.js";

export const getServiceByPhotographersId = async (photographerId) => {
    const service = await Services.findOne({});
};
