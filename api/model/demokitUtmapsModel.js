import mongoose from "mongoose";

const DemokitUtmapsSchema = new mongoose.Schema(
  {
    ProjectName: String,
    Sensor1: String,
    Sensor2: String,
    Sensor3: String,
    Sensor4: String,
  },
  { timestamps: true }
);

const demokitUtmapsModel = mongoose.model("demokitUtmapsData",DemokitUtmapsSchema);
export default demokitUtmapsModel;
