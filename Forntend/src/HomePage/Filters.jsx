import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  PersonOutline,
  WorkOutline,
  StarBorderOutlined,
  LocationOnOutlined,
  AttachMoneyOutlined,
  KeyboardArrowDown,
  DisabledByDefaultOutlined,
} from "@mui/icons-material";

const filterOptions = {
  Skills: ["React", "Node.js", "JavaScript", "Python", "UI/UX"],
  "Job Type": ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
  Experience: ["Fresher", "1 Year", "2 Years", "3+ Years", "5+ Years"],
  Location: ["Remote", "Delhi", "Mumbai", "Bangalore", "Hyderabad"],
  Salary: ["0–3 LPA", "3–6 LPA", "6–10 LPA", "10–20 LPA", "20+ LPA"],
};

const filterIcons = {
  Skills: <PersonOutline sx={{ fontSize: 16 }} />,
  "Job Type": <WorkOutline sx={{ fontSize: 16 }} />,
  Experience: <StarBorderOutlined sx={{ fontSize: 16 }} />,
  Location: <LocationOnOutlined sx={{ fontSize: 16 }} />,
  Salary: <AttachMoneyOutlined sx={{ fontSize: 16 }} />,
};

function FilterPill({ label }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.5,
          py: 0.75,
          border: "1.5px solid #E5E7EB",
          borderRadius: "8px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          bgcolor: "#fff",
          color: "#374151",
          fontSize: "13px",
          fontWeight: 500,
          userSelect: "none",
          flexShrink: 0,
          "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
          transition: "all 0.15s ease",
        }}
      >
        {filterIcons[label]}
        <span>{label}</span>
        <KeyboardArrowDown sx={{ fontSize: 16, color: "#6B7280" }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              minWidth: 160,
            },
          },
        }}
      >
        {filterOptions[label].map((opt) => (
          <MenuItem
            key={opt}
            onClick={() => setAnchorEl(null)}
            sx={{ fontSize: 13 }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function Filters() {
  return (
    <>
      {/* ── MOBILE FILTER BAR (matches the image) ── */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          height:{md:"30px"},
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          px: 1.5,
          py: 1,
          bgcolor: "#fff",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          borderRadius: 2,
          // hide scrollbar
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {Object.keys(filterOptions).map((label) => (
          <FilterPill key={label} label={label} />
        ))}

        {/* Clear Filters pill */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.75,
            borderRadius: "8px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            color: "#DC2626",
            fontSize: "13px",
            fontWeight: 500,
            flexShrink: 0,
            userSelect: "none",
            "&:hover": { bgcolor: "#FEF2F2" },
            transition: "all 0.15s ease",
          }}
        >
          <DisabledByDefaultOutlined sx={{ fontSize: 16 }} />
          <span>Clear Filters</span>
        </Box>
      </Box>

      {/* ── DESKTOP SIDEBAR ── */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 250,
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filters
        </Typography>

        {/* Skills */}
        <Typography variant="subtitle1">Skills</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="React" />
          <FormControlLabel control={<Checkbox />} label="Node.js" />
          <FormControlLabel control={<Checkbox />} label="JavaScript" />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Job Type */}
        <Typography variant="subtitle1">Job Type</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Full-time" />
          <FormControlLabel control={<Checkbox />} label="Internship" />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Experience */}
        <Typography variant="subtitle1">Experience</Typography>
        <Slider
          defaultValue={2}
          step={1}
          marks
          min={0}
          max={5}
          valueLabelDisplay="auto"
          sx={{ color: "#DC2626" }}
        />

        <Divider sx={{ my: 2 }} />

        {/* Buttons */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#DC2626",
            "&:hover": { bgcolor: "#B91C1C" },
            mb: 1,
          }}
        >
          Apply Filters
        </Button>

        <Button fullWidth variant="text" sx={{ color: "#DC2626" }}>
          Clear All
        </Button>
      </Box>
    </>
  );
}