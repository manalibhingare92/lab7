const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Create a new student
router.post('/', async (req, res) => {
    const { firstName, lastName, rollNo, password, contactNumber } = req.body;
    try {
        const newStudent = new Student({ firstName, lastName, rollNo, password, contactNumber });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a student by Roll No
router.put('/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const { contactNumber } = req.body;
    try {
        const student = await Student.findOneAndUpdate({ rollNo }, { contactNumber }, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student by Roll No
router.delete('/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    try {
        const student = await Student.findOneAndDelete({ rollNo });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;