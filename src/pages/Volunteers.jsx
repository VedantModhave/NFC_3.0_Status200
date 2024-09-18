import React, { useState } from 'react';
import { db } from '../firebase/firebase'; // Adjust path as necessary
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VolunteerRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState({});
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!fullName) errors.fullName = 'Full Name is required';
    if (!age || isNaN(age) || age < 0) errors.age = 'Valid Age is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid Email is required';
    if (!phone || phone.length < 10) errors.phone = 'Valid Phone Number is required';
    if (!description) errors.description = 'Description is required';
    if (!location) errors.location = 'Location is required';
    if (!pincode || pincode.length < 6) errors.pincode = 'Valid Pincode is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create a volunteer record in Firestore
      await setDoc(doc(db, 'volunteers', projectId + '_' + Date.now().toString()), {
        projectId,
        name: fullName,
        age,
        email,
        phone,
        description,
        location,
        pincode,
        registeredAt: new Date(),
      });

      // Update the volunteers count in the project
      await updateDoc(doc(db, 'projects', projectId), {
        volunteers: increment(1),
      });

      // Show success notification
      toast.success('Registered Successfully');

      // Redirect after successful registration
      setTimeout(() => {
        navigate('/projects'); // Redirect to Home.jsx page
      }, 1000); // Delay redirection to allow toast message to be visible
    } catch (error) {
      console.error('Error registering volunteer:', error);
      toast.error('Error registering volunteer');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Register for Project</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="border p-2 mb-2 w-full"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="border p-2 mb-2 w-full"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border p-2 mb-2 w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone No</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone No"
            className="border p-2 mb-2 w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">What Describes You Best</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe yourself"
            className="border p-2 mb-2 w-full"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="border p-2 mb-2 w-full"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className="border p-2 mb-2 w-full"
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded w-full sm:w-auto"
        >
          Register
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default VolunteerRegistration;











// abtak chal rha tha







// import React, { useState } from 'react';
// import { db } from '../firebase/firebase'; // Adjust path as necessary
// import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const VolunteerRegistration = () => {
//   const [fullName, setFullName] = useState('');
//   const [age, setAge] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [errors, setErrors] = useState({});
//   const { projectId } = useParams(); // Get project ID from URL
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const errors = {};
//     if (!fullName) errors.fullName = 'Full Name is required';
//     if (!age || isNaN(age) || age < 0) errors.age = 'Valid Age is required';
//     if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid Email is required';
//     if (!phone || phone.length < 10) errors.phone = 'Valid Phone Number is required';
//     if (!description) errors.description = 'Description is required';
//     if (!location) errors.location = 'Location is required';
//     if (!pincode || pincode.length < 6) errors.pincode = 'Valid Pincode is required';

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       // Create a volunteer record in Firestore
//       await setDoc(doc(db, 'volunteers', projectId + '_' + Date.now().toString()), {
//         projectId,
//         name: fullName,
//         age,
//         email,
//         phone,
//         description,
//         location,
//         pincode,
//         registeredAt: new Date(),
//       });

//       // Update the volunteers count in the project
//       await updateDoc(doc(db, 'projects', projectId), {
//         volunteers: increment(1),
//       });

//       // Show success notification
//       toast.success('Registered Successfully');

//       // Redirect after successful registration
//       navigate('/projects'); // Redirect to Projects page or another page
//     } catch (error) {
//       console.error('Error registering volunteer:', error);
//       toast.error('Error registering volunteer');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Register for Project</h2>
//       <form onSubmit={handleRegister} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Full Name</label>
//           <input
//             type="text"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Full Name"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Age</label>
//           <input
//             type="number"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             placeholder="Age"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Phone No</label>
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="Phone No"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">What Describes You Best</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe yourself"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Your Location</label>
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="Location"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Pincode</label>
//           <input
//             type="text"
//             value={pincode}
//             onChange={(e) => setPincode(e.target.value)}
//             placeholder="Pincode"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white py-2 px-4 rounded w-full sm:w-auto"
//         >
//           Register
//         </button>
//       </form>

//       <ToastContainer />
//     </div>
//   );
// };

// export default VolunteerRegistration;

















// import React, { useState } from 'react';
// import { db } from '../firebase/firebase'; // Adjust path as necessary
// import { doc, setDoc } from 'firebase/firestore';
// import { useNavigate, useParams } from 'react-router-dom';

// const VolunteerRegistration = () => {
//   const [fullName, setFullName] = useState('');
//   const [age, setAge] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [errors, setErrors] = useState({});
//   const { projectId } = useParams(); // Get project ID from URL
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const errors = {};
//     if (!fullName) errors.fullName = 'Full Name is required';
//     if (!age || isNaN(age) || age < 0) errors.age = 'Valid Age is required';
//     if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid Email is required';
//     if (!phone || phone.length < 10) errors.phone = 'Valid Phone Number is required';
//     if (!description) errors.description = 'Description is required';
//     if (!location) errors.location = 'Location is required';
//     if (!pincode || pincode.length < 6) errors.pincode = 'Valid Pincode is required';

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       // Create a volunteer record in Firestore
//       await setDoc(doc(db, 'volunteers', projectId + '_' + Date.now().toString()), {
//         projectId,
//         name: fullName,
//         age,
//         email,
//         phone,
//         description,
//         location,
//         pincode,
//         registeredAt: new Date(),
//       });

//       // Redirect after successful registration
//       navigate('/thank-you'); // Redirect to a thank you page or back to project list
//     } catch (error) {
//       console.error('Error registering volunteer:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Register for Project</h2>
//       <form onSubmit={handleRegister} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Full Name</label>
//           <input
//             type="text"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Full Name"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Age</label>
//           <input
//             type="number"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             placeholder="Age"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Phone No</label>
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="Phone No"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">What Describes You Best</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe yourself"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Your Location</label>
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="Location"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Pincode</label>
//           <input
//             type="text"
//             value={pincode}
//             onChange={(e) => setPincode(e.target.value)}
//             placeholder="Pincode"
//             className="border p-2 mb-2 w-full"
//           />
//           {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white py-2 px-4 rounded w-full sm:w-auto"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default VolunteerRegistration;
