import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import { useNavigate } from "react-router-dom";

export default function AllJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // ✅ Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `http://ec2-13-126-64-8.ap-south-1.compute.amazonaws.com:5000/api/allJobs?page=${page}&limit=5`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.success) {
          setJobs(data.jobs);
          setTotalPages(data.totalPages);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    fetchJobs();
  }, [page]);

  // ✅ Open dialog
  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  // ✅ Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const ApplyJOb = () => {
    navigate(`/job/apply/${selectedJob.job_id}`);
  }

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box
        sx={{
          flexWrap: "wrap",
          width: "100%",
          ml: 2,
          mb: 2,
          gap: 2,
        }}
      >
        {jobs.map((job) => (
          <Card
            key={job.job_id}
            sx={{
              flex: "1 1 350px",
              borderRadius: 3,
              boxShadow: 3,
              mb: 2,
              borderLeft: "5px solid #d32f2f",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* LEFT */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#d32f2f" }}>
                    {job.job_name?.[0]}
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {job.job_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {job.company}
                    </Typography>

                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Chip label={job.job_type} size="small" />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {job.experience} Yrs Exp • {job.job_type}
                    </Typography>
                  </Box>
                </Box>

                {/* RIGHT */}
                <Box
                  sx={{
                    textAlign: { xs: "left", md: "right" },
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Typography color="error" fontWeight="bold">
                    ₹{job.min_salary} – ₹{job.max_salary}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth={{ xs: true, md: false }}
                    onClick={() => handleOpenDialog(job)}
                    sx={{
                      mt: 2,
                      backgroundColor: "#d32f2f",
                      "&:hover": {
                        backgroundColor: "#b71c1c",
                      },
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Box>

      {/* ✅ JOB DETAILS POPUP */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: "500px",
            maxWidth: "95%",
          },
        }}
      >
        {selectedJob && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              <Box>
                <Typography component="div" variant="h6" fontWeight="bold">
                  {selectedJob.job_name}
                </Typography>

                <Typography component="div" variant="body2" color="text.secondary">
                  {selectedJob.company}
                </Typography>
              </Box>

              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography fontWeight="bold">Job Type</Typography>
                  <Chip label={selectedJob.job_type} size="small" />
                </Box>

                <Box>
                  <Typography fontWeight="bold">Experience</Typography>
                  <Typography color="text.secondary">
                    {selectedJob.experience} Years
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold">Salary</Typography>
                  <Typography color="error" fontWeight="bold">
                    ₹{selectedJob.min_salary} – ₹{selectedJob.max_salary}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold">Job Role</Typography>
                  <Typography color="text.secondary">
                    {selectedJob.role || "Not mentioned"}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold">Description</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {selectedJob.description || "No description available"}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold">Skills Required</Typography>

                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {selectedJob.skills?.length > 0 ? (
                      selectedJob.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" />
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        No skills mentioned
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} color="inherit">
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={ApplyJOb}
                sx={{
                  backgroundColor: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#b71c1c",
                  },
                }}
              >
                Confirm Apply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}