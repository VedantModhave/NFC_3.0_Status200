import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase'; // Adjust path as necessary
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Project = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [projects, setProjects] = useState({ upcoming: [], completed: [] });
  const [formData, setFormData] = useState({ title: '', venue: '', date: '', volunteers: 0, donations: 0, coordinator: '', details: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error('User document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const upcomingProjects = [];
        const completedProjects = [];

        projectsSnapshot.forEach((doc) => {
          const projectData = doc.data();
          if (projectData.status === 'completed') {
            completedProjects.push({ id: doc.id, ...projectData });
          } else {
            upcomingProjects.push({ id: doc.id, ...projectData });
          }
        });

        setProjects({ upcoming: upcomingProjects, completed: completedProjects });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProject = async () => {
    try {
      if (editMode) {
        await updateDoc(doc(db, 'projects', editId), formData);
        setProjects({
          ...projects,
          upcoming: projects.upcoming.map((project) =>
            project.id === editId ? { ...project, ...formData } : project
          ),
        });
        setEditMode(false);
        setEditId(null);
      } else {
        await addDoc(collection(db, 'projects'), formData);
        setProjects({
          ...projects,
          upcoming: [...projects.upcoming, { id: Date.now().toString(), ...formData }],
        });
      }

      setFormData({ title: '', venue: '', date: '', volunteers: 0, donations: 0, coordinator: '', details: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding/updating project:', error);
    }
  };

  const handleEditProject = (id) => {
    const project = projects.upcoming.find((p) => p.id === id);
    if (project) {
      setFormData({ ...project, volunteers: project.volunteers || 0, donations: project.donations || 0 });
      setEditMode(true);
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects({
        ...projects,
        upcoming: projects.upcoming.filter((project) => project.id !== id),
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCompleteProject = async (id) => {
    try {
      const project = projects.upcoming.find((p) => p.id === id);
      if (project) {
        await updateDoc(doc(db, 'projects', id), { status: 'completed' });
        setProjects({
          ...projects,
          upcoming: projects.upcoming.filter((project) => project.id !== id),
          completed: [...projects.completed, { ...project, status: 'completed' }],
        });
      }
    } catch (error) {
      console.error('Error completing project:', error);
    }
  };

  const handleVolunteerClick = (id) => {
    navigate(`/volunteer/${id}`);
  };

  const handleDonateClick = (id) => {
    navigate(`/donations/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      {role === 'admin' && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          {showForm ? 'Close Form' : 'Add New Project'}
        </button>
      )}
      {showForm && role === 'admin' && (
        <form onSubmit={(e) => e.preventDefault()} className="mb-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            placeholder="Venue"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="Date/Duration"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="number"
            name="volunteers"
            value={formData.volunteers}
            onChange={handleInputChange}
            placeholder="Volunteers"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="number"
            name="donations"
            value={formData.donations}
            onChange={handleInputChange}
            placeholder="Donations"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            name="coordinator"
            value={formData.coordinator}
            onChange={handleInputChange}
            placeholder="Coordinator"
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            placeholder="Details"
            className="border p-2 mb-2 w-full"
            required
          />
          <button
            onClick={handleAddProject}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            {editMode ? 'Update Project' : 'Add Project'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Projects</h2>
        </div>
        {projects.upcoming.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-2"><strong>Venue:</strong> {project.venue}</p>
            <p className="text-gray-700 mb-2"><strong>Date/Duration:</strong> {project.date}</p>
            <p className="text-gray-700 mb-2"><strong>Volunteers Registered:</strong> {project.volunteers}</p>
            <p className="text-gray-700 mb-2"><strong>Donations Received:</strong> {project.donations}</p>
            <p className="text-gray-700 mb-2"><strong>Coordinator:</strong> {project.coordinator}</p>
            <p className="text-gray-700 mb-2"><strong>Details:</strong> {project.details}</p>
            {role === 'admin' && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEditProject(project.id)}
                  className="text-blue-600 text-xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 text-xl"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleCompleteProject(project.id)}
                  className="text-green-600 text-xl"
                >
                  <FaCheck />
                </button>
              </div>
            )}
            {role === 'volunteer' && (
              <div className="mt-4">
                <button
                  onClick={() => handleVolunteerClick(project.id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-full mb-2"
                >
                  Volunteer
                </button>
                <button
                  onClick={() => handleDonateClick(project.id)}
                  className="bg-green-600 text-white py-2 px-4 rounded w-full"
                >
                  Donate
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="col-span-full mt-12">
          <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
        </div>
        {projects.completed.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-2"><strong>Venue:</strong> {project.venue}</p>
            <p className="text-gray-700 mb-2"><strong>Date/Duration:</strong> {project.date}</p>
            <p className="text-gray-700 mb-2"><strong>Volunteers Registered:</strong> {project.volunteers}</p>
            <p className="text-gray-700 mb-2"><strong>Donations Received:</strong> {project.donations}</p>
            <p className="text-gray-700 mb-2"><strong>Coordinator:</strong> {project.coordinator}</p>
            <p className="text-gray-700 mb-2"><strong>Details:</strong> {project.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;







// import React, { useState, useEffect } from 'react';
// import { auth, db } from '../firebase/firebase'; // Adjust path as necessary
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
// import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const Project = () => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [projects, setProjects] = useState({ upcoming: [], completed: [] });
//   const [formData, setFormData] = useState({ title: '', venue: '', date: '', volunteers: 0, donations: 0, coordinator: '', details: '' });
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         try {
//           const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//           if (userDoc.exists()) {
//             setRole(userDoc.data().role);
//           } else {
//             console.error('User document does not exist.');
//           }
//         } catch (error) {
//           console.error('Error fetching user role:', error);
//         }
//       } else {
//         setUser(null);
//         setRole(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const projectsSnapshot = await getDocs(collection(db, 'projects'));
//         const upcomingProjects = [];
//         const completedProjects = [];

//         projectsSnapshot.forEach((doc) => {
//           const projectData = doc.data();
//           if (projectData.status === 'completed') {
//             completedProjects.push({ id: doc.id, ...projectData });
//           } else {
//             upcomingProjects.push({ id: doc.id, ...projectData });
//           }
//         });

//         setProjects({ upcoming: upcomingProjects, completed: completedProjects });
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddProject = async () => {
//     try {
//       if (editMode) {
//         await updateDoc(doc(db, 'projects', editId), formData);
//         setProjects({
//           ...projects,
//           upcoming: projects.upcoming.map((project) =>
//             project.id === editId ? { ...project, ...formData } : project
//           ),
//         });
//         setEditMode(false);
//         setEditId(null);
//       } else {
//         await addDoc(collection(db, 'projects'), formData);
//         setProjects({
//           ...projects,
//           upcoming: [...projects.upcoming, { id: Date.now().toString(), ...formData }],
//         });
//       }

//       setFormData({ title: '', venue: '', date: '', volunteers: 0, donations: 0, coordinator: '', details: '' });
//       setShowForm(false);
//     } catch (error) {
//       console.error('Error adding/updating project:', error);
//     }
//   };

//   const handleEditProject = (id) => {
//     const project = projects.upcoming.find((p) => p.id === id);
//     if (project) {
//       setFormData({ ...project, volunteers: project.volunteers || 0, donations: project.donations || 0 });
//       setEditMode(true);
//       setEditId(id);
//       setShowForm(true);
//     }
//   };

//   const handleDeleteProject = async (id) => {
//     try {
//       await deleteDoc(doc(db, 'projects', id));
//       setProjects({
//         ...projects,
//         upcoming: projects.upcoming.filter((project) => project.id !== id),
//       });
//     } catch (error) {
//       console.error('Error deleting project:', error);
//     }
//   };

//   const handleCompleteProject = async (id) => {
//     try {
//       const project = projects.upcoming.find((p) => p.id === id);
//       if (project) {
//         await updateDoc(doc(db, 'projects', id), { status: 'completed' });
//         setProjects({
//           ...projects,
//           upcoming: projects.upcoming.filter((project) => project.id !== id),
//           completed: [...projects.completed, { ...project, status: 'completed' }],
//         });
//       }
//     } catch (error) {
//       console.error('Error completing project:', error);
//     }
//   };

//   const handleVolunteerClick = (id) => {
//     navigate(`/volunteer/${id}`);
//   };

//   const handleDonateClick = (id) => {
//     navigate(`/donations/${id}`);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       {role === 'admin' && (
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
//         >
//           {showForm ? 'Close Form' : 'Add New Project'}
//         </button>
//       )}
//       {showForm && (
//         <form onSubmit={(e) => e.preventDefault()} className="mb-6">
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Title"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <input
//             type="text"
//             name="venue"
//             value={formData.venue}
//             onChange={handleInputChange}
//             placeholder="Venue"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <input
//             type="text"
//             name="date"
//             value={formData.date}
//             onChange={handleInputChange}
//             placeholder="Date/Duration"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <input
//             type="number"
//             name="volunteers"
//             value={formData.volunteers}
//             onChange={handleInputChange}
//             placeholder="Volunteers"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <input
//             type="number"
//             name="donations"
//             value={formData.donations}
//             onChange={handleInputChange}
//             placeholder="Donations"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <input
//             type="text"
//             name="coordinator"
//             value={formData.coordinator}
//             onChange={handleInputChange}
//             placeholder="Coordinator"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <textarea
//             name="details"
//             value={formData.details}
//             onChange={handleInputChange}
//             placeholder="Details"
//             className="border p-2 mb-2 w-full"
//             required
//           />
//           <button
//             onClick={handleAddProject}
//             className="bg-green-600 text-white py-2 px-4 rounded"
//           >
//             {editMode ? 'Update Project' : 'Add Project'}
//           </button>
//         </form>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="col-span-full">
//           <h2 className="text-2xl font-semibold mb-4">Upcoming Projects</h2>
//         </div>
//         {projects.upcoming.map((project) => (
//           <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//             <p className="text-gray-700 mb-2"><strong>Venue:</strong> {project.venue}</p>
//             <p className="text-gray-700 mb-2"><strong>Date/Duration:</strong> {project.date}</p>
//             <p className="text-gray-700 mb-2"><strong>Volunteers Registered:</strong> {project.volunteers}</p>
//             <p className="text-gray-700 mb-2"><strong>Donations Received:</strong> {project.donations}</p>
//             <p className="text-gray-700 mb-2"><strong>Coordinator:</strong> {project.coordinator}</p>
//             <p className="text-gray-700 mb-2"><strong>Details:</strong> {project.details}</p>
//             {role === 'admin' && (
//               <div className="flex justify-between items-center">
//                 <button
//                   onClick={() => handleEditProject(project.id)}
//                   className="text-blue-600"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteProject(project.id)}
//                   className="text-red-600"
//                 >
//                   <FaTrash />
//                 </button>
//                 <button
//                   onClick={() => handleCompleteProject(project.id)}
//                   className="text-green-600"
//                 >
//                   <FaCheck />
//                 </button>
//               </div>
//             )}
//             {role === 'volunteer' && (
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => handleVolunteerClick(project.id)}
//                   className="bg-blue-600 text-white py-1 px-3 rounded"
//                 >
//                   Volunteer
//                 </button>
//                 <button
//                   onClick={() => handleDonateClick(project.id)}
//                   className="bg-green-600 text-white py-1 px-3 rounded"
//                 >
//                   Donate
//                 </button>
//               </div>

//             )}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//         <div className="col-span-full">
//           <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
//         </div>
//         {projects.completed.map((project) => (
//           <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//             <p className="text-gray-700 mb-2"><strong>Venue:</strong> {project.venue}</p>
//             <p className="text-gray-700 mb-2"><strong>Date/Duration:</strong> {project.date}</p>
//             <p className="text-gray-700 mb-2"><strong>Volunteers Registered:</strong> {project.volunteers}</p>
//             <p className="text-gray-700 mb-2"><strong>Donations Received:</strong> {project.donations}</p>
//             <p className="text-gray-700 mb-2"><strong>Coordinator:</strong> {project.coordinator}</p>
//             <p className="text-gray-700 mb-2"><strong>Details:</strong> {project.details}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Project;












