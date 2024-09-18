import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase'; // Adjust path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // State to store user's role
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch the user's role from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // Assume role is stored in 'role' field
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Determine if the user signed in with Google
  const getProfilePhoto = () => {
    if (user) {
      const googleProvider = user.providerData.find((provider) => provider.providerId === 'google.com');
      if (googleProvider) {
        return googleProvider.photoURL;
      } else {
        return null; // For email sign-in, return null
      }
    }
    return null; // No user
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">NGO-Hub</Link>
        </h1>
        <div className="space-x-4 hidden md:flex items-center">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          {role === 'admin' && (
            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          )}
          <Link to="/projects" className="hover:text-gray-200">Projects</Link>
          {/* {role !== 'admin' && (
            <Link to="/donations" className="hover:text-gray-200">Donate</Link>
          )} */}
          {/* <Link to="/volunteers" className="hover:text-gray-200">Volunteer</Link> */}
          <Link to="/contactus" className="hover:text-gray-200">Contact Us</Link>
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2">
                {getProfilePhoto() ? (
                  <img
                    src={getProfilePhoto()}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-white"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-white" />
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Login/Signup
            </Link>
          )}
        </div>
        <button className="md:hidden text-xl focus:outline-none" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div className={`md:hidden bg-blue-600 text-white ${isOpen ? 'block' : 'hidden'}`}>
        <Link to="/" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Home</Link>
        {role === 'admin' && (
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Dashboard</Link>
        )}
        <Link to="/projects" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Projects</Link>
        {/* {role !== 'admin' && (
          <Link to="/donations" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Donate</Link>
        )} */}
        {/* <Link to="/volunteers" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Volunteer</Link> */}
        {user ? (
          <>
            <Link to="/profile" className="block px-4 py-2 hover:bg-blue-500 flex items-center space-x-2" onClick={toggleMenu}>
              {getProfilePhoto() ? (
                <img
                  src={getProfilePhoto()}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-white"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-white" />
              )}
              <span>Profile</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left hover:bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>
            Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;













// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase'; // Adjust path as necessary
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Determine if the user signed in with Google
//   const getProfilePhoto = () => {
//     if (user) {
//       const googleProvider = user.providerData.find((provider) => provider.providerId === 'google.com');
//       if (googleProvider) {
//         return googleProvider.photoURL;
//       } else {
//         return null; // For email sign-in, return null
//       }
//     }
//     return null; // No user
//   };

//   return (
//     <nav className="bg-blue-600 text-white shadow-md w-full top-0 left-0 z-50">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">
//           <Link to="/">NGO Management</Link>
//         </h1>
//         <div className="space-x-4 hidden md:flex items-center">
//           <Link to="/" className="hover:text-gray-200">Home</Link>
//           <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link> {/* Dashboard Link */}
//           <Link to="/projects" className="hover:text-gray-200">Projects</Link>
//           <Link to="/donations" className="hover:text-gray-200">Donate</Link>
//           <Link to="/volunteers" className="hover:text-gray-200">Volunteer</Link>
//           {user ? (
//             <>
//               <Link to="/profile" className="flex items-center space-x-2">
//                 {getProfilePhoto() ? (
//                   <img
//                     src={getProfilePhoto()}
//                     alt="Profile"
//                     className="w-8 h-8 rounded-full border border-white"
//                   />
//                 ) : (
//                   <FaUserCircle className="w-8 h-8 text-white" />
//                 )}
//               </Link>
//               <button
//                 onClick={handleSignOut}
//                 className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
//               Login/Signup
//             </Link>
//           )}
//         </div>
//         <button className="md:hidden text-xl focus:outline-none" onClick={toggleMenu}>
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//           </svg>
//         </button>
//       </div>
//       <div className={`md:hidden bg-blue-600 text-white ${isOpen ? 'block' : 'hidden'}`}>
//         <Link to="/" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Home</Link>
//         <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Dashboard</Link> {/* Dashboard Link */}
//         <Link to="/projects" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Projects</Link>
//         <Link to="/donations" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Donate</Link>
//         <Link to="/volunteers" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Volunteer</Link>
//         {user ? (
//           <>
//             <Link to="/profile" className="block px-4 py-2 hover:bg-blue-500 flex items-center space-x-2" onClick={toggleMenu}>
//               {getProfilePhoto() ? (
//                 <img
//                   src={getProfilePhoto()}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full border border-white"
//                 />
//               ) : (
//                 <FaUserCircle className="w-8 h-8 text-white" />
//               )}
//               <span>Profile</span>
//             </Link>
//             <button
//               onClick={handleSignOut}
//               className="block w-full px-4 py-2 text-left hover:bg-red-500"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>
//             Login/Signup
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase'; // Adjust path as necessary
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Determine if the user signed in with Google
//   const getProfilePhoto = () => {
//     if (user) {
//       const googleProvider = user.providerData.find((provider) => provider.providerId === 'google.com');
//       if (googleProvider) {
//         return googleProvider.photoURL;
//       } else {
//         return null; // For email sign-in, return null
//       }
//     }
//     return null; // No user
//   };

//   return (
//     <nav className="bg-blue-600 text-white shadow-md w-full top-0 left-0 z-50">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">
//           <Link to="/">NGO Management</Link>
//         </h1>
//         <div className="space-x-4 hidden md:flex items-center">
//           <Link to="/" className="hover:text-gray-200">Home</Link>
//           <Link to="/projects" className="hover:text-gray-200">Projects</Link>
//           <Link to="/donations" className="hover:text-gray-200">Donate</Link>
//           <Link to="/volunteers" className="hover:text-gray-200">Volunteer</Link>
//           {user ? (
//             <>
//               <Link to="/profile" className="flex items-center space-x-2">
//                 {getProfilePhoto() ? (
//                   <img
//                     src={getProfilePhoto()}
//                     alt="Profile"
//                     className="w-8 h-8 rounded-full border border-white"
//                   />
//                 ) : (
//                   <FaUserCircle className="w-8 h-8 text-white" />
//                 )}
//               </Link>
//               <button
//                 onClick={handleSignOut}
//                 className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
//               Login/Signup
//             </Link>
//           )}
//         </div>
//         <button className="md:hidden text-xl focus:outline-none" onClick={toggleMenu}>
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//           </svg>
//         </button>
//       </div>
//       <div className={`md:hidden bg-blue-600 text-white ${isOpen ? 'block' : 'hidden'}`}>
//         <Link to="/" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Home</Link>
//         <Link to="/projects" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Projects</Link>
//         <Link to="/donations" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Donate</Link>
//         <Link to="/volunteers" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Volunteer</Link>
//         {user ? (
//           <>
//             <Link to="/profile" className="block px-4 py-2 hover:bg-blue-500 flex items-center space-x-2" onClick={toggleMenu}>
//               {getProfilePhoto() ? (
//                 <img
//                   src={getProfilePhoto()}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full border border-white"
//                 />
//               ) : (
//                 <FaUserCircle className="w-8 h-8 text-white" />
//               )}
//               <span>Profile</span>
//             </Link>
//             <button
//               onClick={handleSignOut}
//               className="block w-full px-4 py-2 text-left hover:bg-red-500"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>
//             Login/Signup
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase'; // Adjust path as necessary
// import { onAuthStateChanged, signOut } from 'firebase/auth';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="bg-blue-600 text-white shadow-md w-full top-0 left-0 z-50">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">
//           <Link to="/">NGO Management</Link>
//         </h1>
//         <div className="space-x-4 hidden md:flex items-center">
//           <Link to="/" className="hover:text-gray-200">Home</Link>
//           <Link to="/projects" className="hover:text-gray-200">Projects</Link>
//           <Link to="/donations" className="hover:text-gray-200">Donate</Link>
//           <Link to="/volunteers" className="hover:text-gray-200">Volunteer</Link>
//           {user ? (
//             <>
//               <Link to="/profile" className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
//                 Profile
//               </Link>
//               <button
//                 onClick={handleSignOut}
//                 className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
//               Login/Signup
//             </Link>
//           )}
//         </div>
//         <button className="md:hidden text-xl focus:outline-none" onClick={toggleMenu}>
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//           </svg>
//         </button>
//       </div>
//       <div className={`md:hidden bg-blue-600 text-white ${isOpen ? 'block' : 'hidden'}`}>
//         <Link to="/" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Home</Link>
//         <Link to="/projects" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Projects</Link>
//         <Link to="/donations" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Donate</Link>
//         <Link to="/volunteers" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Volunteer</Link>
//         {user ? (
//           <>
//             <Link to="/profile" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>Profile</Link>
//             <button
//               onClick={handleSignOut}
//               className="block w-full px-4 py-2 text-left hover:bg-red-500"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={toggleMenu}>
//             Login/Signup
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
