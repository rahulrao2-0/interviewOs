import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, Toolbar } from "@mui/material";

import Message from "./Message.jsx";
import Jobs from "./Jobs.jsx";
import Applicants from "./Applicants.jsx";
const drawerWidth = 240; // 🔥 IMPORTANT

import {useAuth} from '../AuthContext';  
import { useNavigate } from "react-router-dom";
import DashboardHome from "./DashboardHome.jsx";


export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeView, setActiveView] = React.useState("Dashboard");
  const [selectedApplicant, setSelectedApplicant] = React.useState(null);
  const { user } = useAuth();

  const handleMessageClick = ()=>{
    setActiveView("Messages");
  }

  const handleSelectedUser = (user)=>{
    console.log("Selected user in Dashboard 👉", user);
    setSelectedApplicant(user);
    setActiveView("Messages");
  }
   
  const navigate = useNavigate();

  if(!user){
    navigate("/login");
    return null; // or a loading spinner
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      
      <Header handleDrawerToggle={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        setActiveView={setActiveView}
        drawerWidth={drawerWidth} // pass it
      />

      {/* 🔥 MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // 🔥 FIX
          ml: { sm: `${drawerWidth}px` }, // 🔥 PUSH CONTENT RIGHT
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar />

        {activeView === "Dashboard" && <DashboardHome setActiveView={setActiveView} />}
        {activeView === "Jobs" && <Jobs />}
        {activeView === "Applications" && <Applicants onMessageClick={handleMessageClick} handleSelectedUser={handleSelectedUser} />}
        {activeView === "Saved Jobs" && <h2>Saved Jobs</h2>}
        {activeView === "Companies" && <h2>Companies</h2>}
        {activeView === "Messages" && <Message  selectedApplicant={selectedApplicant} />}
      </Box>
    </Box>
  );
}