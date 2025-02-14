import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function StudentView() {
    const [student, setStudent] = useState({ id: '', name: '', department: '', email: '' });
    const params = useParams();

    // Fetch student data by ID
    const readById = async () => {
        const baseUrl = "http://localhost:8080"; // Ensure your backend URL is correct
        try {
            const response = await axios.get(`${baseUrl}/students/${params.id}`); // Assuming the endpoint for fetching student is /students/{id}
            const queriedStudent = response.data;
            setStudent(queriedStudent);
        } catch (error) {
            alert('Server Error');
        }
    };

    // Fetch the student on component mount
    useEffect(() => {
        readById();
    }, []);

    return (
        <>
            <PageHeader />

            <h3><a href="/students/list" className="btn btn-light">Go Back</a>View Student</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label for="name" className="form-label">Name:</label>
                    <div className="form-control" id="name">{student.name}</div>
                </div>
                <div className="form-group mb-3">
                    <label for="department" className="form-label">Department:</label>
                    <div className="form-control" id="department">{student.department}</div>
                </div>
                <div className="form-group mb-3">
                    <label for="email" className="form-label">Email:</label>
                    <div className="form-control" id="email">{student.email}</div>
                </div>
            </div>
        </>
    );
}

export default StudentView;
