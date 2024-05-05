const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  salary: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true }
});

const Assistant = mongoose.model('Assistant', assistantSchema);

module.exports = Assistant;
