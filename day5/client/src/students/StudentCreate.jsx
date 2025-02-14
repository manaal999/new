import { useState } from "react";
import PageHeader from "../header/PageHeader";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function StudentCreate() {
    // Initialize state for the student object
    const [student, setStudent] = useState({id: '', name: '', department: '', email: ''});
    const navigate = useNavigate();

    // Handle input field changes and update student state
    const txtBoxOnChange = event => {
        const updatedStudent = { ...student };
        updatedStudent[event.target.id] = event.target.value; // Update specific field based on id
        setStudent(updatedStudent);
    };

    // Handle the creation of a new student via an API request
    const createStudent = async () => {
        const baseUrl = "http://localhost:8080"; // Ensure this is your correct API base URL
        try {
            const response = await axios.post(`${baseUrl}/students`, { ...student });
            const createdStudent = response.data.student;
            setStudent(createdStudent); // Update state with the newly created student data
            alert(response.data.message); // Show success message from the backend
            navigate('/students/list'); // Navigate to the student list page
        } catch (error) {
            alert('Server Error'); // Display an error if the API call fails
        }
    };

    return (
        <>
            <PageHeader /> {/* Display the header */}
            <h3><a href="/students/list" className="btn btn-light">Go Back</a> Add Student</h3>
            <div className="container">
                {/* Student Name Input */}
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Student Name:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        placeholder="Please enter student name"
                        value={student.name} 
                        onChange={txtBoxOnChange} 
                    />
                </div>

                {/* Department Input */}
                <div className="form-group mb-3">
                    <label htmlFor="department" className="form-label">Department:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="department" 
                        placeholder="Please enter student department"
                        value={student.department} 
                        onChange={txtBoxOnChange} 
                    />
                </div>

                {/* Email Input */}
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="Please enter student email"
                        value={student.email} 
                        onChange={txtBoxOnChange} 
                    />
                </div>

                {/* Submit Button */}
                <button 
                    className="btn btn-primary" 
                    onClick={createStudent}>
                    Create Student
                </button>
            </div>
        </>
    );
}

export default StudentCreate;
