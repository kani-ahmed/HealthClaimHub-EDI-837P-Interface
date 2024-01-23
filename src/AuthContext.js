import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [welcomeShown, setWelcomeShown] = useState(false);

  const showWelcomeMessage = () => {
    if (!welcomeShown && currentUser) {
      toast.success(`Welcome back, ${currentUser.email}!`);
      setWelcomeShown(true);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setWelcomeShown(false); // Reset the welcomeShown flag here
      setCurrentUser(null); // Optionally reset the currentUser to null
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error (e.g., display an error message)
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Function to get the current user's Firebase ID token
  const getIdToken = () => {
    return currentUser ? currentUser.getIdToken() : Promise.resolve(null);
  };

  const value = {
    currentUser,
    getIdToken,
    signIn: auth.signInWithEmailAndPassword,
    signOut,
    showWelcomeMessage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
