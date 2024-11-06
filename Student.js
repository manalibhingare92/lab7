const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);