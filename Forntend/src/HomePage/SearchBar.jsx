import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function SearchBar() {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        mx: "auto",
        mt: 2,
        mb: 2,
        p: 0.5,
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search by title, company, or skills..."
        variant="standard"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Location Input (❌ hidden on mobile) */}
      <TextField
        fullWidth
        placeholder="Location (e.g. Remote, Delhi)"
        variant="standard"
        
        sx={{
          display: { xs: "none", md: "block" }, // 🔥 hide on mobile
        }}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#d32f2f",
          borderRadius: 2,
          fontWeight: "bold",
          whiteSpace: "nowrap",

          // 🔥 responsive button size
          width: {  md: "auto" },
          px: { xs: 2, md: 5 },   // less padding on mobile
          py: { xs: 1, md: 1.5 }, // smaller height on mobile
          fontSize: { xs: "10px", md: "16px" },

          "&:hover": {
            backgroundColor: "#b71c1c",
          },
        }}
      >
        Search Jobs
      </Button>
    </Box>
  );
}