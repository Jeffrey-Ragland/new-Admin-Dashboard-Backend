import mongoose from 'mongoose';

const IOCLSchema = new mongoose.Schema({
  Sensor1: String,
  Sensor2: String,
  Sensor3: String
}, { timestamps: true});

const ioclModel = mongoose.model('ioclData', IOCLSchema);
export default ioclModel;