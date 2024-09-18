import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaMedal, FaDonate, FaHandsHelping } from 'react-icons/fa'; // Font Awesome icons
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// import { firestore } from '../firebase/firebase'; // Adjust import based on your file structure

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [badges, setBadges] = useState([]); // Badges earned by the user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user role from 'users' collection
        const role = await fetchUserRole(currentUser.uid);
        setProfileType(role);

        if (role === 'volunteer') {
          const projects = await fetchProjectsCount(currentUser.uid);
          const donations = await fetchTotalDonations(currentUser.uid);
          const userBadges = await fetchBadges(currentUser.uid); // Fetch user badges
          setProjectsCount(projects);
          setTotalDonations(donations);
          setBadges(userBadges);
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchUserRole = async (uid) => {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        return userSnapshot.data().role; // Assuming 'role' field exists in the 'users' collection
      } else {
        console.error('No such document!');
        return ''; // Default or handle as needed
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return ''; // Default or handle as needed
    }
  };

  // Fetch the number of projects a volunteer has participated in
  const fetchProjectsCount = async (uid) => {
    try {
      const q = query(collection(db, 'donations'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size; // Number of projects participated in
    } catch (error) {
      console.error('Error fetching projects count:', error);
      return 0;
    }
  };

  // Fetch the total donations made by a volunteer
  const fetchTotalDonations = async (uid) => {
    try {
      const q = query(collection(db, 'donations'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      let total = 0;
      querySnapshot.forEach((doc) => {
        total += parseFloat(doc.data().donationAmount); // Assuming donationAmount is a string in Firestore
      });
      return total;
    } catch (error) {
      console.error('Error fetching total donations:', error);
      return 0;
    }
  };

  // Mock function to fetch badges earned by the user
  const fetchBadges = async (uid) => {
    // Replace with actual badge fetching logic
    return ['Top Volunteer', 'Generous Donor', 'Community Leader']; // Example badges
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNameUpdate = async (newName) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: newName });
        setUser({ ...user, displayName: newName });
      } catch (error) {
        console.error('Error updating name:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-5 flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 text-black">
      <div className="w-full max-w-md p-8 bg-gray-100 shadow-xl rounded-lg">
        <h2 className="text-4xl font-bold mb-6 text-center text-black">User Profile</h2>
        {user ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <p className="mt-1 text-black text-lg font-semibold">{user.displayName || 'N/A'}</p>
              {!user.displayName && (
                <button
                  onClick={() => handleNameUpdate(prompt('Enter your name:'))}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Set Name
                </button>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Profile Type:</label>
              <p className="mt-1 text-black text-lg font-semibold">{profileType}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <p className="mt-1 text-black text-lg font-semibold">{user.email || 'N/A'}</p>
            </div>

            {profileType === 'volunteer' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Projects Participated:</label>
                  <p className="mt-1 text-black text-lg font-semibold">{projectsCount}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Total Donations:</label>
                  <p className="mt-1 text-black text-lg font-semibold">${totalDonations}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Badges Earned:</label>
                  <div className="flex flex-wrap mt-2">
                    {badges.map((badge, index) => (
                      <span
                        key={index}
                        className="flex items-center mr-2 mb-2 px-4 py-2 bg-yellow-300 text-yellow-900 text-xs font-bold rounded-full"
                      >
                        {badge === 'Top Volunteer' && <FaMedal className="mr-2" />}
                        {badge === 'Generous Donor' && <FaDonate className="mr-2" />}
                        {badge === 'Community Leader' && <FaHandsHelping className="mr-2" />}
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-black text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;






// import React, { useEffect, useState } from 'react';
// import { auth } from '../firebase/firebase';
// import { signOut, updateProfile } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { FaMedal, FaDonate, FaHandsHelping } from 'react-icons/fa'; // Font Awesome icons

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profileType, setProfileType] = useState('');
//   const [projectsCount, setProjectsCount] = useState(0);
//   const [totalDonations, setTotalDonations] = useState(0);
//   const [badges, setBadges] = useState([]); // Badges earned by the user
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         setUser(currentUser);
//         const fetchedProfileType = 'Volunteer'; // Replace with actual logic
//         setProfileType(fetchedProfileType);

//         if (fetchedProfileType === 'Volunteer') {
//           const projects = await fetchProjectsCount(currentUser.uid);
//           const donations = await fetchTotalDonations(currentUser.uid);
//           const userBadges = await fetchBadges(currentUser.uid); // Fetch user badges
//           setProjectsCount(projects);
//           setTotalDonations(donations);
//           setBadges(userBadges);
//         }
//       } else {
//         navigate('/login');
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   const handleNameUpdate = async (newName) => {
//     if (user) {
//       try {
//         await updateProfile(user, { displayName: newName });
//         setUser({ ...user, displayName: newName });
//       } catch (error) {
//         console.error('Error updating name:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 flex flex-col items-center justify-center bg-gradient-to-r from-gray-50 to-gray-200 text-black">
//       <div className="w-full max-w-md p-8 bg-gray-100 shadow-xl rounded-lg">
//         <h2 className="text-4xl font-bold mb-6 text-center text-black">User Profile</h2>
//         {user ? (
//           <div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Name:</label>
//               <p className="mt-1 text-black text-lg font-semibold">{user.displayName || 'N/A'}</p>
//               {!user.displayName && (
//                 <button
//                   onClick={() => handleNameUpdate(prompt('Enter your name:'))}
//                   className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   Set Name
//                 </button>
//               )}
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Profile Type:</label>
//               <p className="mt-1 text-black text-lg font-semibold">{profileType}</p>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Email:</label>
//               <p className="mt-1 text-black text-lg font-semibold">{user.email || 'N/A'}</p>
//             </div>

//             {profileType === 'Volunteer' && (
//               <>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Projects Participated:</label>
//                   <p className="mt-1 text-black text-lg font-semibold">{projectsCount}</p>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Total Donations:</label>
//                   <p className="mt-1 text-black text-lg font-semibold">${totalDonations}</p>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Badges Earned:</label>
//                   <div className="flex flex-wrap mt-2">
//                     {badges.map((badge, index) => (
//                       <span
//                         key={index}
//                         className="flex items-center mr-2 mb-2 px-4 py-2 bg-yellow-300 text-yellow-900 text-xs font-bold rounded-full"
//                       >
//                         {badge === 'Top Volunteer' && <FaMedal className="mr-2" />}
//                         {badge === 'Generous Donor' && <FaDonate className="mr-2" />}
//                         {badge === 'Community Leader' && <FaHandsHelping className="mr-2" />}
//                         {badge}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}

//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={handleLogout}
//                 className="px-6 py-2 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="text-black text-center">Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // Mock function to fetch the number of projects a volunteer has participated in
// const fetchProjectsCount = async (uid) => {
//   return 5; // Example return value
// };

// // Mock function to fetch the total donations made by a volunteer
// const fetchTotalDonations = async (uid) => {
//   return 150; // Example return value
// };

// // Mock function to fetch badges earned by the user
// const fetchBadges = async (uid) => {
//   return ['Top Volunteer', 'Generous Donor', 'Community Leader']; // Example badges
// };

// export default Profile;







