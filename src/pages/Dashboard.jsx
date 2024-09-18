import React, { useState } from 'react';
import DashVolunteers from './dashboardContent/DashVolunteers';
import Overview from './dashboardContent/Overview';
import DashEvents from './dashboardContent/DashEvents';
import DashDonations from './dashboardContent/DashDonations';
import Resources from './dashboardContent/Resources';
import Projects from './Projects';
import { HiHome, HiBriefcase, HiCash, HiUserGroup, HiCalendar, HiCollection, HiUsers } from 'react-icons/hi';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'donations':
        return <DashDonations />;
      case 'volunteers':
        return <DashVolunteers />;
      case 'events':
        return <DashEvents/>;
      case 'resources':
        return <Resources />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className={`hidden md:flex md:flex-col md:w-64 md:bg-gray-800 md:text-white`}>
        <div className="flex items-center justify-center p-4 bg-gray-900">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { name: 'Overview', icon: <HiHome />, section: 'dashboard' },
            { name: 'Donations', icon: <HiCash />, section: 'donations' },
            { name: 'Volunteers', icon: <HiUserGroup />, section: 'volunteers' },
            { name: 'Events', icon: <HiCalendar />, section: 'events' },
            { name: 'Resources', icon: <HiCollection />, section: 'resources' },
          ].map((item) => (
            <button
              key={item.section}
              className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                activeSection === item.section ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveSection(item.section)}
            >
              {item.icon} <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 bg-gray-800 text-white md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h1 className="text-2xl font-bold">NGO Hub</h1>
          <button className="text-white" onClick={() => setSidebarOpen(false)}>X</button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { name: 'Dashboard', icon: <HiHome />, section: 'dashboard' },
            { name: 'Donations', icon: <HiCash />, section: 'donations' },
            { name: 'Volunteers', icon: <HiUserGroup />, section: 'volunteers' },
            { name: 'Events', icon: <HiCalendar />, section: 'events' },
            { name: 'Resources', icon: <HiCollection />, section: 'resources' },
          ].map((item) => (
            <button
              key={item.section}
              className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                activeSection === item.section ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveSection(item.section);
                setSidebarOpen(false); // Close sidebar on selection
              }}
            >
              {item.icon} <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:ml-10 overflow-y-auto">
        <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>☰</button>
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
