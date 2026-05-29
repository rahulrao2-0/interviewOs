import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Divider,
} from "@mui/material";

import {
  CalendarMonth,
  AccessTime,
  Business,
  VideoCall,
  CheckCircle,
} from "@mui/icons-material";

const interviews = [
  {
    id: 1,
    candidate: "Rahul Yadav",
    role: "Frontend Developer",
    company: "TechNova",
    date: "12 Aug 2026",
    time: "11:00 AM",
    status: "Upcoming",
  },

  {
    id: 2,
    candidate: "Aman Kumar",
    role: "Backend Developer",
    company: "CodeCraft",
    date: "14 Aug 2026",
    time: "02:30 PM",
    status: "Completed",
  },

  {
    id: 3,
    candidate: "Priya Sharma",
    role: "UI/UX Designer",
    company: "PixelWorks",
    date: "16 Aug 2026",
    time: "04:00 PM",
    status: "Cancelled",
  },
];

export default function ScheduledInterview({ setActiveView }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return {
          bgcolor: "#dbeafe",
          color: "#1d4ed8",
        };

      case "Completed":
        return {
          bgcolor: "#dcfce7",
          color: "#166534",
        };

      case "Cancelled":
        return {
          bgcolor: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7fb",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 5,
          background:
            "linear-gradient(135deg,#0f172a,#2563eb)",
          color: "#fff",
          mb: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={900}
        >
          Scheduled Interviews
        </Typography>

        <Typography
          sx={{
            mt: 2,
            maxWidth: 800,
            opacity: 0.9,
            lineHeight: 1.8,
            fontSize: 16,
          }}
        >
          Manage all your candidate interviews in
          one place. Track interview schedules,
          monitor interview status, and stay
          organized with your hiring process.
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            title="Total Interviews"
            value="24"
          />

          <StatCard
            title="Upcoming"
            value="10"
          />

          <StatCard
            title="Completed"
            value="11"
          />

          <StatCard
            title="Cancelled"
            value="3"
          />
        </Box>
      </Paper>

      {/* INTERVIEW LIST */}

      <Box
        sx={{
          display: "grid",
          gap: 3,
        }}
      >
        {interviews.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              {/* LEFT */}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 65,
                    height: 65,
                    bgcolor: "#2563eb",
                    fontSize: 24,
                    fontWeight: 900,
                  }}
                >
                  {item.candidate.charAt(0)}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    {item.candidate}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                    }}
                  >
                    {item.role}
                  </Typography>

                  <Chip
                    label={item.status}
                    sx={{
                      mt: 1.5,
                      fontWeight: 800,
                      ...getStatusStyle(
                        item.status
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* RIGHT */}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                  minWidth: 250,
                }}
              >
                <InfoRow
                  icon={<Business />}
                  text={item.company}
                />

                <InfoRow
                  icon={<CalendarMonth />}
                  text={item.date}
                />

                <InfoRow
                  icon={<AccessTime />}
                  text={item.time}
                />
              </Box>
            </Box>

            <Divider />

            {/* ACTIONS */}

            <Box
              sx={{
                p: 2,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "flex-end",
                bgcolor: "#f8fafc",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                Reschedule
              </Button>

              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={<VideoCall />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#2563eb",
                }}
              >
                Join Interview
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                Mark Complete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

function StatCard({ title, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        minWidth: 170,
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          opacity: 0.8,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={900}
        mt={1}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function InfoRow({ icon, text }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        color: "#334155",
      }}
    >
      {icon}

      <Typography
        sx={{
          fontWeight: 700,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}