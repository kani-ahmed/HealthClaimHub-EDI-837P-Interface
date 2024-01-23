// Layout.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import './BillingHistory.css';

const Layout = ({ children }) => {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async (event) => {
    event.preventDefault(); // Prevent the navigation to the /logout path
    try {
      await signOut();
      toast.success("Signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink exact to="/" activeClassName="active">Home</NavLink>
          </li>
          {currentUser && (
            <li className="nav-item">
              <NavLink to="/billing-history" activeClassName="active">Billing History</NavLink>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <NavLink to="/add-clients" activeClassName="active">Add Clients</NavLink>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <NavLink to="/logout" onClick={handleSignOut}>Sign Out</NavLink>
            </li>
          )}
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;








// Layout.js working second iteration
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import { toast } from 'react-toastify';
// import './BillingHistory.css';

// const Layout = ({ children }) => {
//   const { currentUser, signOut } = useAuth();

//   const handleSignOut = async (event) => {
//     try {
//       await signOut();
//       toast.success("Signed out successfully.");
//     } catch (error) {
//       console.error("Error signing out:", error);
//       toast.error("Failed to sign out.");
//     }
//     event.preventDefault(); // Prevent default link behavior
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="nav-list">
//           <li className="nav-item">
//             <NavLink exact to="/" activeClassName="active">Home</NavLink>
//           </li>
//           {currentUser && (
//             <li className="nav-item">
//               <NavLink to="/billing-history" activeClassName="active">Billing History</NavLink>
//             </li>
//           )}
//           {currentUser && (
//             <li className="nav-item">
//               {/* Use NavLink with the onClick event for Sign Out */}
//               <NavLink to="/" onClick={handleSignOut}>Sign Out</NavLink>
//             </li>
//           )}
//         </ul>
//       </nav>
//       <main>{children}</main>
//     </div>
//   );
// };

// export default Layout;














// // Layout.js
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from './AuthContext'; // Import useAuth
// import { toast } from 'react-toastify';
// import './BillingHistory.css';
// import { Button } from '@mui/material'; // Import Button from MUI

// const Layout = ({ children }) => {
//   const { currentUser, signOut } = useAuth(); // Destructure signOut from useAuth

//   // Logout function
//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       toast.success("Signed out successfully.");
//     } catch (error) {
//       console.error("Error signing out:", error);
//       toast.error("Failed to sign out.");
//     }
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="nav-list">
//           <li className="nav-item">
//             <NavLink exact to="/" activeClassName="active">Home</NavLink>
//           </li>
//           {currentUser && (
//             <li className="nav-item">
//               <NavLink to="/billing-history" activeClassName="active">Billing History</NavLink>
//             </li>
//           )}
//           {currentUser && (
//             <li className="nav-item">
//               <Button onClick={handleSignOut} color="inherit">Sign Out</Button>
//             </li>
//           )}
//         </ul>
//       </nav>
//       <main>{children}</main>
//     </div>
//   );
// };

// export default Layout;
