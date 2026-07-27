import { useState } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        query: query.trim() || undefined,
        location: location.trim() || undefined,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        mx: "auto",
        mt: 3,
        mb: 4,
        p: 1,
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 14px 35px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search by title, company, or skills..."
        variant="standard"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1, color: "#64748b" }}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          px: 1,
          "& input": {
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 500,
            color: "#1e293b",
          },
        }}
      />

      {/* Location Input (❌ hidden on mobile) */}
      <TextField
        fullWidth
        placeholder="Location (e.g. Remote, Delhi)"
        variant="standard"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          display: { xs: "none", md: "block" },
          borderLeft: "1px solid #e2e8f0",
          px: 2,
          "& input": {
            fontSize: "16px",
            fontWeight: 500,
            color: "#1e293b",
          },
        }}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "#64748b" }}>
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Button */}
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          borderRadius: "12px",
          fontWeight: 700,
          whiteSpace: "nowrap",
          textTransform: "none",
          boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
          width: { md: "auto" },
          px: { xs: 2.5, md: 4 },
          py: { xs: 1.2, md: 1.5 },
          fontSize: { xs: "13px", md: "15px" },
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            boxShadow: "0 6px 20px rgba(239, 68, 68, 0.6)",
            transform: "translateY(-1px)",
          },
        }}
      >
        Search Jobs
      </Button>
    </Box>
  );
}