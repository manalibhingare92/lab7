import React, { useState, useEffect } from 'react';
import './Form.css';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [students, setStudents] = useState([]); // To store and display all student records
  const [isEditing, setIsEditing] = useState(false); // To track update mode
  const [editRollNo, setEditRollNo] = useState(null); // Track the Roll No being edited

  // Load student data when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching student data', error);
    }
  };

  // Validate the form fields
  const validateForm = () => {
    let validationErrors = {};
    if (!formData.firstName) {
      validationErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName) {
      validationErrors.lastName = 'Last Name is required';
    }
    if (!formData.rollNo) {
      validationErrors.rollNo = 'Roll No is required';
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.contactNumber) {
      validationErrors.contactNumber = 'Contact Number is required';
    }

    return validationErrors;
  };

  // Handle form submission for both Create and Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If no validation errors, submit the form data to backend
    if (Object.keys(validationErrors).length === 0) {
      try {
        if (isEditing) {
          // Update student details
          const response = await axios.put(`http://localhost:5000/students/${editRollNo}`, {
            contactNumber: formData.contactNumber
          });
          setSuccessMessage('Student details updated successfully!');
        } else {
          // Create new student
          const response = await axios.post('http://localhost:5000/students', formData);
          setSuccessMessage('Student registered successfully!');
        }

        // Reset form and fetch updated student list
        setFormData({
          firstName: '',
          lastName: '',
          rollNo: '',
          password: '',
          confirmPassword: '',
          contactNumber: ''
        });
        setErrors({});
        fetchStudents();
        setIsEditing(false); // Reset edit mode

      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrors({ server: error.response.data.message });
        } else {
          setErrors({ server: 'An error occurred while submitting the form' });
        }
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Handle deleting a student by Roll No
  const handleDelete = async (rollNo) => {
    try {
      await axios.delete(`http://localhost:5000/students/${rollNo}`);
      setSuccessMessage('Student deleted successfully!');
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error deleting student', error);
    }
  };

  // Set the form for editing a student's details
  const handleEdit = (student) => {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      rollNo: student.rollNo,
      password: '', // You may want to handle password updates separately
      confirmPassword: '',
      contactNumber: student.contactNumber
    });
    setIsEditing(true);
    setEditRollNo(student.rollNo);
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Student Details' : 'Student Registration Form'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Form Fields */}
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'input-error' : ''}
            disabled={isEditing} // Disable editing of first name in update mode
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'input-error' : ''}
            disabled={isEditing} // Disable editing of last name in update mode
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll No:</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            className={errors.rollNo ? 'input-error' : ''}
            disabled={isEditing} // Disable editing of roll number in update mode
          />
          {errors.rollNo && <span className="error-message">{errors.rollNo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={errors.contactNumber ? 'input-error' : ''}
          />
          {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
        </div>

        {errors.server && <span className="error-message">{errors.server}</span>}
        <button type="submit" className="submit-btn">
          {isEditing ? 'Update' : 'Submit'}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>

      {/* Student List (Table) */}
      <h3>Registered Students</h3>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo}>
              <td>{student.rollNo}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.contactNumber}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.rollNo)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form;