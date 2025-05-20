import mongoose from "mongoose";

const PhotographsSchema = new mongoose.Schema({
    PhotographerId: {
        type: mongoose.Types.ObjectId,
        ref: "Photographers",
        localField: "PhotographerId",
        foreignField: "PhotographerId",
    },
    imgUrl: [String],
});

const Photographs = mongoose.model("Photographs", PhotographsSchema);

export default Photographs;
