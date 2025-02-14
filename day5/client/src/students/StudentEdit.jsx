import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function StudentEdit() {
    const [student, setStudent] = useState({id: '', name: '', department: '', email: ''});
    const params = useParams();
    const navigate = useNavigate();

    // Handle input field changes and update student state
    const txtBoxOnChange = event => {
        const updatedStudent = { ...student };
        updatedStudent[event.target.id] = event.target.value; // Update specific field based on id
        setStudent(updatedStudent);
    };

    // Fetch student data by ID
    const readById = async () => {
        const baseUrl = "http://localhost:8080"; // Make sure this matches your backend
        try {
            const response = await axios.get(`${baseUrl}/students/${params.id}`);
            const queriedStudent = response.data;
            setStudent(queriedStudent); // Set student data from the response
        } catch (error) {
            alert('Server Error');
        }
    };

    // Update student data
    const updateStudent = async () => {
        const baseUrl = "http://localhost:8080"; // Make sure this matches your backend
        try {
            const response = await axios.put(`${baseUrl}/students/${params.id}`, { ...student });
            const updatedStudent = response.data.student;
            setStudent(updatedStudent); // Update state with the updated student data
            alert(response.data.message); // Show success message from backend
            navigate('/students/list'); // Navigate to the student list page
        } catch (error) {
            alert('Server Error');
        }
    };

    // Fetch student data on initial render
    useEffect(() => {
        readById();
    }, []);

    return (
        <>
            <PageHeader /> {/* Display the header */}
            <h3><a href="/students/list" className="btn btn-light">Go Back</a> Edit Student</h3>
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

                {/* Update Button */}
                <button 
                    className="btn btn-warning" 
                    onClick={updateStudent}>
                    Update Student
                </button>
            </div>
        </>
    );
}

export default StudentEdit;
