import mongoose from "mongoose";

const galeryCategorySchema = new mongoose.Schema({
    galeryCategoryName: String,
});

const GaleryCategory = mongoose.model("GaleryCategory", galeryCategorySchema);

export default GaleryCategory;
