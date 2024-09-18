NGO-Hub

NGO-Hub is a comprehensive platform designed to facilitate efficient management of Non-Governmental Organizations (NGOs). The platform allows users to manage volunteers and admins and various other aspects to ensure smooth operations. It provides a user-friendly interface, secure authentication, role-based access.

Table of Contents

Features
Tech Stack
Setup and Installation
Firebase Integration
Usage
Features

User Authentication: Secure user authentication using Firebase, supporting email/password and Google sign-in.
Role-Based Access: Users are categorized as Admins, Volunteers with role-based access control to specific features.
Mentor Management: Allows users to register as mentors and provides a list of mentors for booking sessions.
Volunteer Management: Volunteers can register, view, and manage their profiles and projects.
Donation Management: Integration for secure payments and donations, with detailed tracking.
Responsive Design: Fully responsive user interface built with ReactJS and Tailwind CSS.
Admin Dashboard: Admins have access to a dashboard for managing users, donations, and projects.
Tech Stack

Frontend: ReactJS, Tailwind CSS
Backend: Firebase (Firestore, Authentication)
Version Control: Git
Setup and Installation

Clone the Repository:

git clone https://github.com/Jatin-gorana/NFC_Status200/ngo-hub.git

cd ngo-hub
Install Dependencies:

npm install
Set Up Firebase:

Create a Firebase project in the Firebase Console. Enable Firestore, Authentication, and other services as needed. Create a .env file in the root directory and add your Firebase configuration details:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
Run the Application:

npm start
The application will be running on http://localhost:3000.

Firebase Integration

Authentication: Firebase Authentication is used for user sign-in and sign-up, supporting both email/password and Google sign-in methods.
Firestore: Used for storing user data, such as admin profiles, volunteer details, and donation records.
Firestore Rules: Ensure proper security rules are set up to control access to your Firestore data based on user roles.
Usage

Admin Dashboard: Log in as an Admin to manage users, donations, and projects.
Volunteer Registration: Volunteers can register and view projects they are part of.
Make a Donation: Use payment gateway to make secure donations.
