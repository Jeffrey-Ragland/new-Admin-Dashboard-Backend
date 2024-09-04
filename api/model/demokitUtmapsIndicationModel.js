import mongoose from "mongoose";

const demokitUtmapsIndicationSchema = new mongoose.Schema({
  ProjectNumber: String,
  ModelLimitS1: Number,
  ModelLimitS2: Number,
});

const demokitUtmapsIndicationModel = mongoose.model('demokitUtmapsIndication', demokitUtmapsIndicationSchema);
export default demokitUtmapsIndicationModel;