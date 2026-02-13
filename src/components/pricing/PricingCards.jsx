import { Box, Typography, Paper, Grid } from "@mui/material";
import { fmt, pct } from "../../utils/helpers";

const getRateColor = (rate) => {
  if (rate >= 50) return "success.main";
  if (rate >= 30) return "warning.main";
  return "error.main";
};

function InfoRow({ label, value, color }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="baseline"
      mb={1}
    >
      <Typography fontSize={13} color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600} color={color}>
        {value}
      </Typography>
    </Box>
  );
}

function PricingCard({ menu, targetRate }) {
  const { cost, sellingPrice, currentRate, recommendedPrice, diff } = menu;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography fontWeight={700} mb={1}>
        {menu.name}
      </Typography>

      <InfoRow label="원가" value={`${fmt(Math.round(cost))}원`} />
      <InfoRow label="현재 판매가" value={`${fmt(sellingPrice)}원`} />
      <InfoRow
        label="현재 이익률"
        value={`${pct(currentRate)}%`}
        color={getRateColor(currentRate)}
      />

      <Box sx={{ mt: 1, pt: 1, borderTop: "1px dashed #e0e0e0" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography fontSize={13} fontWeight={600} color="primary">
            추천 판매가 ({targetRate}%)
          </Typography>
          <Typography fontWeight={700} color="primary.main" fontSize={18}>
            {recommendedPrice ? `${fmt(recommendedPrice)}원` : "—"}
          </Typography>
        </Box>
        {diff !== null && (
          <Typography
            fontSize={12}
            textAlign="right"
            color={
              diff > 0
                ? "error.main"
                : diff < 0
                  ? "success.main"
                  : "text.secondary"
            }
          >
            {diff > 0
              ? `현재보다 ${fmt(diff)}원 올려야 합니다`
              : diff < 0
                ? `현재보다 ${fmt(Math.abs(diff))}원 여유 있습니다`
                : "현재 판매가와 동일합니다"}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function PricingCards({ menuData, targetRate }) {
  return (
    <Grid container spacing={2} mb={3}>
      {menuData.map((m) => (
        <Grid item xs={12} sm={6} key={m.id}>
          <PricingCard menu={m} targetRate={targetRate} />
        </Grid>
      ))}
    </Grid>
  );
}
