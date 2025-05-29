import Photographs from "../../models/Photographs.js";

export const getImageByPhotographerId = async (photographerId) => {
    const photos = await Photographs.find();
    return photos;
};
