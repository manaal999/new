import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function StudentList() {
    const [students, setStudents] = useState([{ id: '', name: '', department: '', email: '' }]);

    // Fetch all students
    const readAllStudents = async () => {
        try {
            const baseUrl = 'http://localhost:8080'; // Ensure your backend URL is correct
            const response = await axios.get(`${baseUrl}/students`); // Assuming the endpoint for students is /students
            const queriedStudents = response.data;
            setStudents(queriedStudents);
        } catch (error) {
            alert('Server Error');
        }
    };

    // Delete a student by ID
    const deleteStudent = async (id) => {
        if (!window.confirm("Are you sure to delete?")) {
            return;
        }
        const baseUrl = "http://localhost:8080"; // Ensure your backend URL is correct
        try {
            const response = await axios.delete(`${baseUrl}/students/${id}`); // Assuming the endpoint for deleting students is /students/{id}
            alert(response.data.message);
            await readAllStudents(); // Refresh the list after deletion
        } catch (error) {
            alert('Server Error');
        }
    };

    // Fetch students on component mount
    useEffect(() => {
        readAllStudents();
    }, []);

    return (
        <>
            <PageHeader />
            <h3>List of Students</h3>
            <div className="container">
                <table className="table table-success table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Department</th>
                            <th scope="col">Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(students && students.length > 0) ? students.map((student) => {
                            return (
                                <tr key={student.id}>
                                    <th scope="row">{student.id}</th>
                                    <td>{student.name}</td>
                                    <td>{student.department}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <a href={`/students/view/${student.id}`} className="btn btn-success">View</a>
                                        &nbsp;
                                        <a href={`/students/edit/${student.id}`} className="btn btn-warning">Edit</a>
                                        &nbsp;
                                        <button className="btn btn-danger" onClick={() => deleteStudent(student.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : <tr><td colSpan="5">No Data Found</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default StudentList;