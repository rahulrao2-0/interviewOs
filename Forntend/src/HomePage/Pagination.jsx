import React from "react";
import { Pagination, Stack } from "@mui/material";

export default function PaginationBar({ page, setPage, totalPages }) {
  
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
      <Pagination
        count={10}
        page={page}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        siblingCount={2}     // 👈 show pages around current
        boundaryCount={1} 
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#DC2626",
            borderColor: "#DC2626",
          },
          "& .Mui-selected": {
            backgroundColor: "#DC2626 !important",
            color: "white",
          },
        }}
      />
    </Stack>
  );
}