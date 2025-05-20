import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    Name: {
        type: String,
        require: true,
    },
    Description: {
        type: String,
        require: true,
    },
    Price: Number,
});

const Services = mongoose.model("Services", ServiceSchema);

export default Services;
