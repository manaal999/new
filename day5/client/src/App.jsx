import StudentList from './students/StudentList'
import StudentCreate from './students/StudentCreate'
import StudentView from './students/StudentView'
import StudentEdit from './students/StudentEdit'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/students/list" element={<StudentList />} />
            <Route path="/students/create" element={<StudentCreate />} />
            <Route path="/students/view/:id" element={<StudentView />} />
            <Route path="/students/edit/:id" element={<StudentEdit />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
