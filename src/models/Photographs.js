import mongoose from "mongoose";

const PhotographsSchema = new mongoose.Schema({
    imgUrl: [String],
});

const Photographs = mongoose.model("Photographs", PhotographsSchema);

export default Photographs;
