import mongoose from "mongoose";

const DemokitZtarSchema = new mongoose.Schema(
  {
    ProjectName: String,
    Level: String,
  },
  { timestamps: true }
);

const demokitZtarModel = mongoose.model(
  "demokitZtarData",
  DemokitZtarSchema
);
export default demokitZtarModel;
