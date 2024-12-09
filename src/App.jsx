import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { query, collection, where, getDocs } from "firebase/firestore";
import { firestoreKey } from "./firebase/FirebaseKey";
import "./App.css";
import Homepage from "./pages/Homepage";
import SearchedItem from "./pages/SearchedItem";
import BookFinder from "./pages/BookFinder";
import SearchedBook from "./pages/SearchedBook";
import ViewBook from "./pages/ViewBook";
import CitationGenerator from "./pages/CitationGenerator";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import SaveDatas from "./pages/SaveDatas";
import Home from "./pages/Home";
import ScrollToTop from "./comp/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import Computational from "./pages/Computational";
import Settings from "./comp/settings/Settings";
import AdminPage from "./pages/AdminPage";
import Support from "./pages/Support";
import Banned from "./pages/Banned";
import LoadingSvg from "./comp/LoadingSvg";
import IsUser from "./comp/IsUser";
import Navbar from "./comp/wasd/Navbar";
import Dictionary from "./pages/Dictionary";

const ProtectedRoute = ({ children, user, isBanned }) => {
  if (!user) return <Navigate to="/sign-in" replace />;
  if (isBanned) return <Navigate to="/banned" replace />;
  return children;
};

const App = () => {
  const [user] = IsUser(); // Custom hook to get the user
  const [isBanned, setIsBanned] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check banned status
  const checkUserStatus = async (currentUser) => {
    if (!currentUser) return;
    try {
      const usersCollection = collection(firestoreKey, "userCollectionOfSave");
      const q = query(usersCollection, where("Uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setIsBanned(userData.isBanned || false);
        });
      }
    } catch (error) {
      console.error("Error checking banned status:", error);
    }
  };

  // Fetch user status on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user) {
        await checkUserStatus(user);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Handle loading state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSvg />
      </div>
    );
  }

  return (
    <Router>
      <div className="">
        
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/support" element={<Support />} />
          <Route path="/banned" element={<Banned />} />
          {/* <Route path="/article" element={<Homepage />} /> */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <Home />
              </ProtectedRoute>
            }
          /> <Route
          path="/article"
          element={
            <ProtectedRoute user={user} isBanned={isBanned}>
              <Homepage />
            </ProtectedRoute>
          }
        />
          <Route
            path="/saved-datas"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <SaveDatas />
              </ProtectedRoute>
            }
          />
           <Route
            path="/dictionary"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <Dictionary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/:query/:page"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <SearchedItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-finder"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <BookFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-book/:bookQuery/:page"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <SearchedBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/searched-book/:bookID"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <ViewBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citation-generator"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <CitationGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/computational-intelligence"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <Computational />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute user={user} isBanned={isBanned}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
