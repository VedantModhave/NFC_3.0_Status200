import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/Home';
import Admin from './pages/Admin';
import ProjectsPage from './pages/Projects';
import DonationsPage from './pages/Donations';
import VolunteersPage from './pages/Volunteers';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute'; // Ensure this component handles authentication
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import './App.css';
import CertificateGenerator from './components/CertificateGenerator';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={<PrivateRoute><Admin /></PrivateRoute>} // Ensure PrivateRoute checks auth status
        />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/volunteer/:projectId" element={<VolunteersPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/donations/:id" element={<DonationsPage />} />
        <Route path="/certificate" element={<CertificateGenerator />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;










// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LandingPage from './pages/Home';
// import Admin from './pages/Admin';
// import ProjectsPage from './pages/Projects';
// import DonationsPage from './pages/Donations';
// import VolunteersPage from './pages/Volunteers';
// import AuthPage from './pages/AuthPage';
// import PrivateRoute from './components/PrivateRoute';
// import Navbar from './pages/Navbar';
// import Footer from './pages/Footer';
// import Profile from './pages/Profile';
// import Dashboard from './pages/Dashboard'

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<AuthPage />} />
//         <Route path="/signup" element={<AuthPage />} />
//         <Route
//           path="/admin"
//           element={<PrivateRoute><Admin /></PrivateRoute>}
//         />
//         <Route path="/projects" element={<ProjectsPage />} />
//         <Route path="/donations" element={<DonationsPage />} />
//         <Route path="/volunteers" element={<VolunteersPage />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// };

// export default App;
