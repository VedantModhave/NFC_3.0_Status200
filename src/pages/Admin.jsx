import React from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const AdminPage = () => {
  const { user } = useAuth(); // Get user from context

  if (!user || !user.isAdmin) {
    return <div className="text-red-500">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="bg-blue-600 text-white py-4 mb-8">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      </header>
      <main>
        <section>
          <h2 className="text-xl font-bold mb-4">Manage Projects</h2>
          {/* Add project management functionalities */}
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Manage Donations</h2>
          {/* Add donation management functionalities */}
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Manage Volunteers</h2>
          {/* Add volunteer management functionalities */}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
