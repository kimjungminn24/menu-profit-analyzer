import { Box, Typography, LinearProgress } from "@mui/material";
import { fmt, pct } from "../../utils/helpers";

const getBarColor = (rate) => {
  if (rate >= 50) return "#16a34a";
  if (rate >= 30) return "#d97706";
  return "#dc2626";
};

export default function ProfitBarChart({ menuData }) {
  const sorted = [...menuData].sort((a, b) => b.rate - a.rate);
  const maxRate =
    sorted.length > 0 ? Math.max(...sorted.map((m) => m.rate), 1) : 1;

  return (
    <>
      <Typography variant="subtitle2" mb={1}>
        메뉴별 이익률 비교
      </Typography>
      <Box display="flex" flexDirection="column" gap={1} mb={3}>
        {sorted.map((m) => (
          <Box key={m.id} display="flex" alignItems="center" gap={1}>
            <Typography sx={{ width: 120 }}>{m.name}</Typography>
            <LinearProgress
              variant="determinate"
              value={(m.rate / maxRate) * 100}
              sx={{
                flex: 1,
                height: 16,
                borderRadius: 1,
                bgcolor: "#f3f4f6",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getBarColor(m.rate),
                },
              }}
            />
            <Typography sx={{ width: 80, textAlign: "right", fontWeight: 600 }}>
              +{fmt(Math.round(m.profit))}원
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}
