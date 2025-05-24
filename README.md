# Advanced Vehicle Care System with Feedback Analysis and Data Exploration

## RapidSaver

RapidSaver is a modern web application for seamless vehicle service booking, management, and feedback analysis. Built with React, TypeScript, Firebase, Redux, and Tailwind CSS.

---

## Features

- **User Portal**
  - Book vehicle services online with real-time slot availability
  - Select from a variety of services and request vehicle pickup and delivery
  - Secure online payments (Card simulation)
  - View real-time status updates
  - View upcoming and past bookings
  - Manage account information
  - Add feedback on the service received

- **Admin Portal**
  - Secure admin login
  - Manage all bookings (view, update status)
  - Analyze user feedback and sentiment
  - View and manage user and driver accounts
  - Add services and time slots
  - Create driver accounts

- **Driver Portal**
  - Secure driver login
  - View assigned bookings (upcoming and past)
  - Update booking status (pickup and delivery)

- **Feedback & Reviews**
  - Users can submit feedback with star ratings
  - Instant sentiment analysis on feedback
  - Admin can review all feedback and sentiment analytics

- **Other Highlights**
  - Responsive, modern UI with Tailwind CSS
  - Google Maps integration for service location
  - Geocoding API for checking distance between service station and user location
  - Redux for state management
  - Called an API through HuggingFace for sentiment analysis on feedback
  - Firebase Authentication and both Firestore and real-time database for backend

---

## Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Authentication, Firestore Database
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Ant Design**: UI components
- **SweetAlert2**: Beautiful alerts and modals
- **Vite**: Fast build tool

---

## Installation

1. **Clone the repository**
    git clone https://github.com/KenathKapilarathna/RapidSaver.git
    

2. **Navigate to the project folder**
    cd Advanced-Vehicle-Care-System
    

3. **Install dependencies**
    npm install
    

4. **Run the development server**
    npm run dev
    

5. **Open in browser**
    Visit [http://localhost:5173] your localhost

---

## Important Testing Information

- You can use test credentials provided in this readme file for admin, driver, and user logins.
- For real data, register a new user or add data directly in Firebase Firestore.
- Admin and driver roles must be set in the Firestore user document.

---

## Source Code Access

- The complete source code is available in this repository.
- For any generated or legacy code (such as `dataconnect-generated`), see the respective folders for details.

---

## Project Structure

```
.
├── src/
│   ├── components/ui/         # Reusable UI components (carousel, reviews, etc.)
│   ├── pages/                 # Page-level components (home, booking, admin, driver, user, login)
│   ├── config/                # Firebase config, API functions
│   ├── redux/                 # Redux store and slices
│   ├── routes/                # App routes
│   └── assets/                # Images and static assets
├── public/                    # Static files
├── dataconnect/               # Data Connect schema/config
├── dataconnect-generated/     # Auto-generated SDKs
├── app.css                    # Main global styles
├── tailwind.config.js         # Tailwind CSS config
├── package.json               # Project dependencies and scripts
└── ...
```

---

## Configuration

- This web app requires Firebase setup.
- Update `src/config/firebase.ts` or `.env` with your Firebase credentials.

---

## Future Enhancements

- Mobile app development 
- Advanced predictive analytics
- Loyalty and reward system 
- Automated reports generation

---

## Credentials

- **Admin**: careadmin@gmail.com / care2001
- **Driver**: driver1@gmail.com / 123456
- **User**: sadun20010101@gmail.com / sadun2001

Users can effortlessly sign up and create their own accounts.  
Drivers, however, must be registered exclusively by an admin to ensure proper verification and control.