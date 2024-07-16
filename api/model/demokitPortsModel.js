import mongoose from "mongoose";

const DemokitPortsSchema = new mongoose.Schema(
  {
    ProjectName: String,
    Temperature: String,
    Density: String,
    Viscosity: String,
  },
  { timestamps: true }
);

const demokitPortsModel = mongoose.model(
  "demokitPortsData",
  DemokitPortsSchema
);
export default demokitPortsModel;
