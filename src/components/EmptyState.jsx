import { Typography, Paper } from "@mui/material";

export default function EmptyState({
  message = "등록된 항목이 없습니다",
  sub,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: "center",
        borderStyle: "dashed",
        borderColor: "#d1d5db",
      }}
    >
      <Typography fontSize={14} color="text.secondary">
        {message}
      </Typography>
      {sub && (
        <Typography fontSize={12} color="text.secondary" mt={0.5}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}
