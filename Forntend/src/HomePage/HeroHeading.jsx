import { Box, Typography } from "@mui/material";

export default function HeroHeading() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 5,
        mb: 4,
        px: 2,
      }}
    >
      {/* Main Heading */}
      <Typography
        variant="h3"
        sx={{
          fontSize: {
            xs: "2.2rem",
            sm: "3.2rem",
            md: "4rem",
          },
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#0f172a",
          lineHeight: 1.2,
        }}
      >
        Find Your Next{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Opportunity
        </span>
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h6"
        sx={{
          fontSize: {
            xs: "1rem",
            sm: "1.15rem",
          },
          mt: 1.5,
          color: "#64748b",
          fontWeight: 500,
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        Search jobs, internships & placement opportunities
      </Typography>
    </Box>
  );
}