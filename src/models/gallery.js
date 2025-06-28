import mongoose from "mongoose";

const galerySchema = new mongoose.Schema({
    galeryCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GaleryCategory",
    },
    galery: [String],
});

const Galery = mongoose.model("Galery", galerySchema);

export default Galery;
