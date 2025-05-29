import mongoose from "mongoose";

const PhotographerProfileSchema = new mongoose.Schema({
    ExperienceYear: {
        type: String,
        require: true,
    },
    PhotographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Rating: {
        type: Number,
        default: 0,
    },
    Location: {
        type: String,
        require: true,
    },
    Device: {
        type: String,
    },
    Description: {
        type: String,
    },
    Services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Services",
    },
    Price: String,
    PhotoGraphs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photographs",
    },
});

const PhotographerProfile = mongoose.model(
    "Photographer",
    PhotographerProfileSchema
);

export default PhotographerProfile;
