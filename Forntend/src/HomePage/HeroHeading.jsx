import { Box, Typography } from "@mui/material";

export default function HeroHeading() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 2,
        mb: 2,
        px: 2,
      }}
    >
      {/* Main Heading */}
      <Typography
        variant="h3"
        sx={{
          fontSize:{
            xs: "1.8rem", // mobile
           sm: "2.4rem",
           md: "3rem",
          },
          fontWeight: "bold",
          color: "#263238",
        }}
      >
        Find Your Next{" "}
        <span style={{ color: "#d32f2f" }}>Opportunity</span>
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h6"
        sx={{
          fontSize:{
            xs:"1rem"

          },
          
          color: "gray",
          fontWeight: 400,
        }}
      >
        Search jobs, internships & placement opportunities
      </Typography>
    </Box>
  );
}