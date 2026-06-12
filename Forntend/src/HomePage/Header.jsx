import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Profile from '../Student/Profile';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import MailIcon from "@mui/icons-material/Mail";
import "./Header.css";
import { Dashboard } from '@mui/icons-material';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'My Applications', 'Dashboard', 'Help', 'Logout'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("Header user 👉", user);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://interviewos.online/api/profile", {
          credentials: "include",
        });
        const data = await res.json();
        // Do something with the profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMockInterview = () => {
    if (user?.user.user_id) {
      navigate(`/interview-room/${user.user.user_id}`);
    } else {
      navigate("/login");
    }
  }

  console.log("User in Header:", user);

  const handleStudentMessages = () => {
    if (user?.user.user_id) {
      navigate(`/student/messages/${user.user.user_id}`);
    } else {
      navigate("/login");
    }
  }

  const handleCloseUserMenu = (item) => {

    if (item === "Profile") {
      navigate(`/profile/${user?.user?.user_id}`);
    }
    if (item === "Logout") {
      const logout = async () => {
        const response = await fetch("https://interviewos.online/api/logout", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json();
        console.log("Logout response:", data);
      }
      logout();
      navigate("/login");
    }
    if (item === "My Applications") {
      navigate("/my-applications");
    }
    if (item === "Dashboard") {
      if (user?.user?.role === "user") {
        navigate(`/profile/${user?.user?.user_id}`);
      } else if (user?.user?.role === "interviewer") {
        navigate("/interviewer/dashboard");
      }
    }
    if (item === "Help") {
      navigate("/help");
    }

    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#b71c1c" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              mr: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'white',
                lineHeight: 1,
              }}
            >

              <i class="fa-solid fa-box"></i>InterviewOS
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#ffcdd2',
                fontSize: '12px',
              }}
            >
              Find Jobs & Internship
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'white',
            }}
          >
            InterviewOS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {user?.user?.role !== "interviewer" && (
            <Button
              onClick={handleStudentMessages}
              variant="contained"
              sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                marginRight: "16px",
                textTransform: "none",
                padding: "8px 18px",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              <i className="fa-regular fa-message"></i> &nbsp;
              Messages
            </Button>
          )}
          {user ? (<>
            <Box sx={{ flexGrow: 0 }}>
              <Button
                onClick={handleMockInterview}
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "8px",
                  marginRight: "16px",
                  textTransform: "none",
                  padding: "8px 18px",
                  backgroundColor: "Red",
                }}
              >
                Start Mock Interview
              </Button>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >


                {settings.map((item) => (
                  <MenuItem key={item} onClick={() => { handleCloseUserMenu(item) }}>
                    <Typography textAlign="center">{item}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>) : (<>
            <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
          </>)}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;

