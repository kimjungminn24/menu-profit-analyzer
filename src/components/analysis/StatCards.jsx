import { Paper, Typography, Grid } from "@mui/material";
import { fmt, pct } from "../../utils/helpers";

function StatCard({ label, value, unit, color }) {
  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="h6" color={color}>
        {value}
      </Typography>
      <Typography variant="body2">{unit || "\u00A0"}</Typography>
    </Paper>
  );
}

export default function StatCards({
  menuCount,
  totalCost,
  totalProfit,
  avgRate,
}) {
  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={6} sm={3}>
        <StatCard label="메뉴 수" value={menuCount} unit="개" />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          label="총 원가"
          value={fmt(Math.round(totalCost))}
          unit="원"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          label="총 이익"
          value={fmt(Math.round(totalProfit))}
          unit="원/개"
          color={totalProfit >= 0 ? "success.main" : "error.main"}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard label="평균 이익률" value={`${pct(avgRate)}%`} />
      </Grid>
    </Grid>
  );
}
