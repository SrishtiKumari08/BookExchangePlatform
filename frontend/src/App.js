import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadBook from "./pages/UploadBook";
import Dashboard from "./pages/Dashboard";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import EditBook from "./pages/EditBook";

import Landing from "./pages/Landing";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { isLoggedIn } = useAuth();
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;