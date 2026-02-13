import { Box, Typography, Slider, TextField, Paper, Chip } from "@mui/material";

const PRESETS = [30, 50, 70];

export default function TargetRateInput({ targetRate, setTargetRate }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="subtitle2" mb={1}>
        목표 이익률
      </Typography>
      <Box display="flex" alignItems="center" gap={3}>
        <Slider
          min={10}
          max={90}
          step={1}
          value={targetRate}
          onChange={(_, v) => setTargetRate(v)}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}%`}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          size="small"
          value={targetRate}
          onChange={(e) => {
            const v = Math.min(90, Math.max(10, Number(e.target.value)));
            setTargetRate(v);
          }}
          sx={{ width: 80 }}
          inputProps={{ min: 10, max: 90 }}
        />
        <Typography fontWeight={700} fontSize={18}>
          %
        </Typography>
      </Box>
      <Box display="flex" gap={1} mt={1}>
        {PRESETS.map((p) => (
          <Chip
            key={p}
            label={`${p}%`}
            size="small"
            variant={targetRate === p ? "filled" : "outlined"}
            color={targetRate === p ? "primary" : "default"}
            onClick={() => setTargetRate(p)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>
    </Paper>
  );
}
