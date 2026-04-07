import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Registration from './pages/Registration';
import AttendanceSession from './pages/AttendanceSession';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/faculty/register" element={<Registration />} />
          <Route path="/faculty/attendance" element={<AttendanceSession />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
