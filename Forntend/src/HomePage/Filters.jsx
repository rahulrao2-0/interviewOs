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
  Skills:   ["React", "Node.js", "JavaScript", "Python", "UI/UX"],
  "Job Type": ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
  Experience: ["Fresher", "1 Year", "2 Years", "3+ Years", "5+ Years"],
  Location:   ["Remote", "Delhi", "Mumbai", "Bangalore", "Hyderabad"],
  Salary:     ["0–3 LPA", "3–6 LPA", "6–10 LPA", "10–20 LPA", "20+ LPA"],
};

const filterIcons = {
  Skills:     <PersonOutline sx={{ fontSize: 16 }} />,
  "Job Type": <WorkOutline sx={{ fontSize: 16 }} />,
  Experience: <StarBorderOutlined sx={{ fontSize: 16 }} />,
  Location:   <LocationOnOutlined sx={{ fontSize: 16 }} />,
  Salary:     <AttachMoneyOutlined sx={{ fontSize: 16 }} />,
};

/* ─────────────────────────────
   Mobile Pill  — single-select per category
───────────────────────────── */
function FilterPill({ label, selected, onSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSelect = (opt) => {
    // toggle off if already selected, else pick new
    onSelect(label, selected === opt ? null : opt);
    setAnchorEl(null);
  };

  const isActive = selected !== null && selected !== undefined;

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
          border: isActive ? "1.5px solid #1976d2" : "1.5px solid #E5E7EB",
          borderRadius: "8px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          bgcolor: isActive ? "#EFF6FF" : "#fff",
          color: isActive ? "#1976d2" : "#374151",
          fontSize: "13px",
          fontWeight: 500,
          userSelect: "none",
          flexShrink: 0,
          "&:hover": { borderColor: "#D1D5DB", bgcolor: isActive ? "#DBEAFE" : "#F9FAFB" },
          transition: "all 0.15s ease",
        }}
      >
        {filterIcons[label]}
        <span>{isActive ? selected : label}</span>
        <KeyboardArrowDown sx={{ fontSize: 16, color: isActive ? "#1976d2" : "#6B7280" }} />
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
            onClick={() => handleSelect(opt)}
            selected={selected === opt}
            sx={{ fontSize: 13 }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

/* ─────────────────────────────
   Main Filters Component
───────────────────────────── */
export default function Filters({ onFilterChange }) {

  /* ── shared filter state ── */
  const [filters, setFilters] = useState({
    skills:     [],        // multi-select (desktop checkboxes)
    job_type:   [],        // multi-select (desktop checkboxes)
    experience: null,      // single-select (slider maps to label)
    salary:     null,      // single-select (mobile pill / future desktop)
    location:   null,      // single-select
  });

  /* ── mobile pills use single-select per category ── */
  const [mobileSelected, setMobileSelected] = useState({
    Skills:     null,
    "Job Type": null,
    Experience: null,
    Location:   null,
    Salary:     null,
  });

  /* ── desktop slider value (0-4 maps to experience labels) ── */
  const expLabels = ["Fresher", "1 Year", "2 Years", "3+ Years", "5+ Years"];
  const [expSlider, setExpSlider] = useState(0);

  /* ─────────────────────────────
     Mobile pill select handler
  ───────────────────────────── */
  const handleMobileSelect = (category, value) => {
    const updated = { ...mobileSelected, [category]: value };
    setMobileSelected(updated);

    // map pill categories → filter keys
    const categoryKeyMap = {
      Skills:     "skills",
      "Job Type": "job_type",
      Experience: "experience",
      Location:   "location",
      Salary:     "salary",
    };

    const key = categoryKeyMap[category];
    let updatedFilters;

    if (key === "skills" || key === "job_type") {
      // wrap single mobile selection in array for API compatibility
      updatedFilters = {
        ...filters,
        [key]: value ? [value] : [],
      };
    } else {
      updatedFilters = { ...filters, [key]: value };
    }

    setFilters(updatedFilters);
    onFilterChange(buildParams(updatedFilters));
  };

  /* ─────────────────────────────
     Desktop checkbox handler
  ───────────────────────────── */
  const handleCheckbox = (key, value, checked) => {
    const current = filters[key];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);

    const updatedFilters = { ...filters, [key]: updated };
    setFilters(updatedFilters);
    // don't fire API yet — wait for Apply button on desktop
  };

  /* ─────────────────────────────
     Desktop slider handler
  ───────────────────────────── */
  const handleSlider = (_, val) => {
    setExpSlider(val);
    // don't fire API yet — wait for Apply button
  };

  /* ─────────────────────────────
     Build query params object from filter state
  ───────────────────────────── */
  const buildParams = (f) => {
    const params = {};

    if (f.skills?.length)   params.skills   = f.skills.join(",");
    if (f.job_type?.length) params.job_type = f.job_type.join(",");
    if (f.experience)       params.experience = f.experience;
    if (f.salary)           params.salary   = f.salary;
    if (f.location)         params.location = f.location;

    return params;
  };

  /* ─────────────────────────────
     Desktop Apply
  ───────────────────────────── */
  const handleApply = () => {
    const withExp = { ...filters, experience: expLabels[expSlider] };
    setFilters(withExp);
    onFilterChange(buildParams(withExp));
  };

  /* ─────────────────────────────
     Clear All
  ───────────────────────────── */
  const handleClear = () => {
    const cleared = {
      skills: [], job_type: [], experience: null, salary: null, location: null,
    };
    setFilters(cleared);
    setMobileSelected({
      Skills: null, "Job Type": null, Experience: null, Location: null, Salary: null,
    });
    setExpSlider(0);
    onFilterChange({});   // empty params = fetch all jobs
  };

  return (
    <>
      {/* ── MOBILE FILTER BAR ── */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          px: 1.5,
          py: 1,
          bgcolor: "#fff",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          borderRadius: 2,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {Object.keys(filterOptions).map((label) => (
          <FilterPill
            key={label}
            label={label}
            selected={mobileSelected[label]}
            onSelect={handleMobileSelect}
          />
        ))}

        <Box
          onClick={handleClear}
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
          {filterOptions.Skills.map((skill) => (
            <FormControlLabel
              key={skill}
              label={skill}
              control={
                <Checkbox
                  size="small"
                  checked={filters.skills.includes(skill)}
                  onChange={(e) => handleCheckbox("skills", skill, e.target.checked)}
                />
              }
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Job Type */}
        <Typography variant="subtitle1">Job Type</Typography>
        <FormGroup>
          {["Full-time", "Part-time", "Internship", "Contract"].map((type) => (
            <FormControlLabel
              key={type}
              label={type}
              control={
                <Checkbox
                  size="small"
                  checked={filters.job_type.includes(type)}
                  onChange={(e) => handleCheckbox("job_type", type, e.target.checked)}
                />
              }
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Experience */}
        <Typography variant="subtitle1" gutterBottom>
          Experience
        </Typography>
        <Typography variant="caption" sx={{ color: "#6B7280" }}>
          {expLabels[expSlider]}
        </Typography>
        <Slider
          value={expSlider}
          onChange={handleSlider}
          step={1}
          marks
          min={0}
          max={4}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => expLabels[v]}
          sx={{ color: "#1976d2" }}
        />

        <Divider sx={{ my: 2 }} />

        {/* Apply / Clear */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleApply}
          sx={{
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1259a7" },
            mb: 1,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Apply Filters
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={handleClear}
          sx={{ color: "#DC2626", textTransform: "none" }}
        >
          Clear All
        </Button>
      </Box>
    </>
  );
}