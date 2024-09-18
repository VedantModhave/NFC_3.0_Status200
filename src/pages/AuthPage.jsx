import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase'; // Ensure proper import paths for Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore'; // For adding user role in Firestore
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // No default role
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Sign-up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          role, // Capture the role from user input
        });

        toast.success('Sign-up successful!');
        redirectBasedOnRole(role);
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          redirectBasedOnRole(userData.role); // Redirect based on stored role
        } else {
          console.log('No such document!');
        }

        toast.success('Login successful!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch or set user role in Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Optionally, prompt for role selection or set a default role
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          role: 'volunteer', // Default role if new user
        });
      }

      toast.success('Google sign-in successful!');
      navigate('/'); // Redirect to Home.jsx or the default page for your app
    } catch (error) {
      toast.error(error.message);
    }
  };

  const redirectBasedOnRole = (userRole) => {
    if (userRole === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/'); // Default redirect for non-admin users
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="mb-4 text-2xl font-bold text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          {isSignUp && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-500 rounded">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-sm text-blue-500 underline"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center p-2 bg-white border rounded shadow-md"
          >
            <svg
              className="w-6 h-6 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8c0-15.5-1.4-30.3-4-44.5H250v89.8h135.7c-5.9 31.6-23.6 58.3-50.2 76l81.5 63.7c47.6-44 75-108.9 75-185.5z"
              ></path>
              <path
                fill="currentColor"
                d="M250 472c64.6 0 118.7-21.5 158.2-58.1l-81.5-63.7c-22.3 15-50.5 24-76.7 24-59.3 0-109.5-40-127.4-94.6H48.4v59.4C90.1 422.3 164 472 250 472z"
              ></path>
              <path
                fill="currentColor"
                d="M122.6 280.7c-8-24-8-50.5 0-74.5V147h-74.2c-31.7 61.1-31.7 132.4 0 193.6l74.2-60.3z"
              ></path>
              <path
                fill="currentColor"
                d="M250 104c34.9 0 66.1 11.9 90.6 35.1l67.8-67.8C368.8 32 319.3 12 250 12 164 12 90.1 61.9 48.4 147l74.2 59.3c17.8-54.5 68.1-94.3 127.4-94.3z"
              ></path>
            </svg>
            Sign in with Google
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginSignUp;













// Google signup not working


// import React, { useState } from 'react';
// import { auth, db } from '../firebase/firebase'; // Ensure proper import paths for Firebase
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { setDoc, doc, getDoc } from 'firebase/firestore'; // For adding user role in Firestore
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const LoginSignUp = () => {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState(''); // No default role
//   const navigate = useNavigate();

//   const handleAuth = async (e) => {
//     e.preventDefault();

//     try {
//       if (isSignUp) {
//         // Sign-up logic
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Save user role to Firestore
//         await setDoc(doc(db, 'users', user.uid), {
//           name,
//           email,
//           role, // Capture the role from user input
//         });

//         toast.success('Sign-up successful!');
//         redirectBasedOnRole(role);
//       } else {
//         // Login logic
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Fetch user role from Firestore
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           redirectBasedOnRole(userData.role); // Redirect based on stored role
//         } else {
//           console.log('No such document!');
//         }

//         toast.success('Login successful!');
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const redirectBasedOnRole = (userRole) => {
//     if (userRole === 'admin') {
//       navigate('/dashboard');
//     } else {
//       navigate('/');
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       // const result = await signInWithPopup(auth, googleProvider);
//       // const user = result.user;

//       // If new user, prompt for role selection (handle this flow appropriately)
//       // Save the role in Firestore if necessary
//       toast.success('Google sign-in successful!');
//       redirectBasedOnRole('volunteer'); // Adjust based on your role retrieval logic
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white rounded shadow-md w-96">
//         <h2 className="mb-4 text-2xl font-bold text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>
//         <form onSubmit={handleAuth}>
//           {isSignUp && (
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-2 mb-2 border rounded"
//             />
//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           {isSignUp && (
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-2 mb-2 border rounded"
//               required
//             >
//               <option value="" disabled>
//                 Select Role
//               </option>
//               <option value="volunteer">Volunteer</option>
//               <option value="admin">Admin</option>
//             </select>
//           )}
//           <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-500 rounded">
//             {isSignUp ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <button
//           onClick={() => setIsSignUp(!isSignUp)}
//           className="mt-4 text-sm text-blue-500 underline"
//         >
//           {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
//         </button>
//         <div className="flex items-center justify-center mt-4">
//           <button
//             onClick={handleGoogleSignIn}
//             className="flex items-center p-2 bg-white border rounded shadow-md"
//           >
//             <svg
//               className="w-6 h-6 mr-2"
//               aria-hidden="true"
//               focusable="false"
//               data-prefix="fab"
//               data-icon="google"
//               role="img"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 488 512"
//             >
//               <path
//                 fill="currentColor"
//                 d="M488 261.8c0-15.5-1.4-30.3-4-44.5H250v89.8h135.7c-5.9 31.6-23.6 58.3-50.2 76l81.5 63.7c47.6-44 75-108.9 75-185.5z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M250 472c64.6 0 118.7-21.5 158.2-58.1l-81.5-63.7c-22.3 15-50.5 24-76.7 24-59.3 0-109.5-40-127.4-94.6H48.4v59.4C90.1 422.3 164 472 250 472z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M122.6 280.7c-8-24-8-50.5 0-74.5V147h-74.2c-31.7 61.1-31.7 132.4 0 193.6l74.2-60.3z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M250 104c34.9 0 66.1 11.9 90.6 35.1l67.8-67.8C368.8 32 319.3 12 250 12 164 12 90.1 61.9 48.4 147l74.2 59.3c17.8-54.5 68.1-94.3 127.4-94.3z"
//               ></path>
//             </svg>
//             Sign in with Google
//           </button>
//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default LoginSignUp;














// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, googleProvider, db } from '../firebase/firebase'; // Make sure to import db from your Firebase configuration
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // import axios from 'axios';

// const LoginSignUp = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [role, setRole] = useState('volunteer'); // Default to 'volunteer'
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleRoleChange = (e) => setRole(e.target.value);
//   const handleNameChange = (e) => setName(e.target.value);
//   const handleEmailChange = (e) => setEmail(e.target.value);
//   const handlePasswordChange = (e) => setPassword(e.target.value);

//   // Helper function to display success notifications
//   const notifySuccess = (message) => {
//     toast.success(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   // Helper function to display error notifications
//   const notifyError = (message) => {
//     toast.error(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isLogin) {
//         // Handle login
//         await signInWithEmailAndPassword(auth, email, password);
//         notifySuccess('Login successful!');
//       } else {
//         // Handle signup
//         await createUserWithEmailAndPassword(auth, email, password);
//         notifySuccess(`Account created successfully as a ${role}!`);
//       }

//       // After login/signup, get user and token
//       const user = auth.currentUser;
//       if (user) {
        

//         // Redirect based on role
//         if (role === 'admin') {
//           navigate('/dashboard'); // Redirect to Dashboard for Admin
//         } else if (role === 'volunteer') {
//           navigate('/'); // Redirect to Home for Volunteer
//         }
//       }
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       notifyError(error.message);
//     }
//   };

//   // Handle Google sign-in
//   const handleGoogleSignIn = async () => {
//     try {
//       // Sign in with Google
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Notify the user of successful sign-in
//       notifySuccess('Signed in with Google successfully!');

//       // Get a reference to the user's document in Firestore
//       const userDocRef = doc(db, 'users', user.uid);

//       // Check if the user document already exists
//       const userDoc = await getDoc(userDocRef);

//       let userRole = 'volunteer'; // Default role

//       // If the user document doesn't exist, create it with default role
//       if (!userDoc.exists()) {
//         await setDoc(userDocRef, {
//           uid: user.uid,
//           email: user.email,
//           role: userRole, // Adjust this if you have a role selection process
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//         });
//       } else {
//         // If the document exists, use the role from Firestore
//         userRole = userDoc.data().role || 'volunteer';
//       }

//       // Redirect based on the user's role
//       if (userRole === 'admin') {
//         navigate('/dashboard'); // Redirect to Dashboard for Admin
//       } else {
//         navigate('/'); // Redirect to Home for Volunteer
//       }
//     } catch (error) {
//       // Handle errors during sign-in
//       console.error('Error during Google sign-in:', error);
//       notifyError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-200 text-white">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">
//           {isLogin ? 'Login' : 'Sign Up'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={name}
//                 onChange={handleNameChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={handleEmailChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={handlePasswordChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-300">
//                 I want to become a:
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={role}
//                 onChange={handleRoleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="volunteer">Volunteer</option>
//               </select>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//           <div className="mt-4 text-center">
//             <button
//               type="button"
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-400 hover:underline"
//             >
//               {isLogin ? 'Create an account' : 'Already have an account?'}
//             </button>
//           </div>
//         </form>
//         <div className="mt-6 flex justify-center">
//           <button
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               aria-hidden="true"
//               focusable="false"
//               data-prefix="fab"
//               data-icon="google"
//               role="img"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 488 512"
//             >
//               <path
//                 fill="currentColor"
//                 d="M488 261.8c0-15.5-1.4-30.3-4-44.5H250v89.8h135.7c-5.9 31.6-23.6 58.3-50.2 76l81.5 63.7c47.6-44 75-108.9 75-185.5z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M250 472c64.6 0 118.7-21.5 158.2-58.1l-81.5-63.7c-22.3 15-50.5 24-76.7 24-59.3 0-109.5-40-127.4-94.6H48.4v59.4C90.1 422.3 164 472 250 472z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M122.6 280.7c-8-24-8-50.5 0-74.5V147h-74.2c-31.7 61.1-31.7 132.4 0 193.6l74.2-60.3z"
//               ></path>
//               <path
//                 fill="currentColor"
//                 d="M250 104c34.9 0 66.1 11.9 90.6 35.1l67.8-67.8C368.8 32 319.3 12 250 12 164 12 90.1 61.9 48.4 147l74.2 59.3c17.8-54.5 68.1-94.3 127.4-94.3z"
//               ></path>
//             </svg>
//             Sign in with Google
//           </button>
//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default LoginSignUp;



