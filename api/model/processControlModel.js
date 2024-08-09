import mongoose from "mongoose";

const processControlSchema = new mongoose.Schema(
    {
        currentProject: String,
    },
);

const processControlModel = mongoose.model('processControl', processControlSchema);
export default processControlModel;