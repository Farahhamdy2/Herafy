import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Aboutus from './pages/Aboutus/Aboutus';
import Contact from './pages/Contact/Contact'; 
import Services from './pages/Services/Services';
import ComplaintMain from './pages/Complaint-main/Complaint-main';
import UserLogin from './pages/User-Login/UserLogin';
import UserRegister from './pages/User-Register/UserRegister';
import TechLogin from './pages/Tech-Login/TechLogin';
import TechRegister from './pages/Tech-Register/TechRegister';
import Electric from './pages/kahrba/Kahrba';
import Carpentry from './pages/ngaraa/ngara';
import Plumbing from './pages/sbaka/sbaka';
import Painting from './pages/n2asha/painting';
import ProfileFanni from './pages/Fanni Profile/Profile Info/Profile';
import HistoryTech from './pages/Fanni Profile/History/History';
import UserProfile from './pages/User Profile/UserProfile';
import Calendar from './pages/Calendar/Calendar';
import Book from './pages/Booking/Booking';
import ForgotPassword from './pages/FogotPassword/ForgotPass';
import ForgotPasswordTech from './pages/FogotPassword-Tech/ForgotPassTech';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/UserLog" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/complaint" element={<ComplaintMain />} />
        <Route path="/UserLog" element={<UserLogin />} />
        <Route path="/UserReg" element={<UserRegister />} />
        <Route path="/TechLog" element={<TechLogin />} />
        <Route path="/TechReg" element={<TechRegister />} />
        
        {/* Protected Routes */}
        <Route path="/Electric" element={
          <ProtectedRoute>
            <Electric />
          </ProtectedRoute>
        } />
        <Route path="/Carpentry" element={
          <ProtectedRoute>
            <Carpentry />
          </ProtectedRoute>
        } />
        <Route path="/Plumbing" element={
          <ProtectedRoute>
            <Plumbing />
          </ProtectedRoute>
        } />
        <Route path="/Painting" element={
          <ProtectedRoute>
            <Painting />
          </ProtectedRoute>
        } />
        <Route path="/TechProfile" element={
          <ProtectedRoute>
            <ProfileFanni />
          </ProtectedRoute>
        } />
        <Route path="/Tech" element={
          <ProtectedRoute>
            <HistoryTech />
          </ProtectedRoute>
        } />
        <Route path="/User" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/Calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/Booking" element={
          <ProtectedRoute>
            <Book />
          </ProtectedRoute>
        } />
        
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ForgotPasswordTech" element={<ForgotPasswordTech />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
