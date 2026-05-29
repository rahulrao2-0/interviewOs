import * as React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import MessageIcon from "@mui/icons-material/Message";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Jobs", icon: <WorkIcon /> },
  { text: "Applications", icon: <DescriptionIcon /> },
  { text: "Saved Jobs", icon: <BookmarkIcon /> },
  { text: "Scheduled Interviews", icon: <BusinessIcon /> },
  { text: "Messages", icon: <MessageIcon /> },
];

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  setActiveView,
}) {
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  const handleItemClick = (item) => {
    setActiveItem(item);
    setActiveView(item);

    if (handleDrawerToggle) {
      handleDrawerToggle(); // close on mobile
    }
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = activeItem === item.text;

          return (
            <ListItemButton
              key={item.text}
              onClick={() => handleItemClick(item.text)}
              sx={{
                backgroundColor: isActive ? "#ffe5e5" : "transparent",
                "&:hover": {
                  backgroundColor: "#ffe5e5",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#d32f2f" : "#ef5350",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{
                  color: isActive ? "#d32f2f" : "#333",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* 📱 MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "61px",
            backgroundColor: "#f8f9fa",
            color: "#333",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 💻 DESKTOP */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
            color: "#333",
            marginTop: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}