import { useState } from "react";
import { fmt, pct, calcMenuCost, profitRate, BASE_LBL } from "../utils/helpers";
import {
  Box,
  Typography,
  Grid,
  Slider,
  TextField,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
  Chip,
} from "@mui/material";

const PRESETS = [30, 50, 70];

export default function PricingTab({ menus, ingredients }) {
  const [targetRate, setTargetRate] = useState(50);

  const menuData = menus.map((m) => {
    const cost = calcMenuCost(m, ingredients);
    const currentRate = profitRate(m.sellingPrice, cost);
    // 목표 이익률로 역산: 판매가 = 원가 / (1 - 목표이익률/100)
    const recommendedPrice =
      targetRate < 100 ? Math.ceil(cost / (1 - targetRate / 100)) : null;
    const diff = recommendedPrice ? recommendedPrice - m.sellingPrice : null;

    // 구간별 추천가
    const presetPrices = PRESETS.map((r) => ({
      rate: r,
      price: r < 100 ? Math.ceil(cost / (1 - r / 100)) : null,
    }));

    return {
      ...m,
      cost,
      currentRate,
      recommendedPrice,
      diff,
      presetPrices,
    };
  });

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        목표 이익률을 설정하면 메뉴별 적정 판매가를 역산합니다.
      </Typography>

      {menus.length === 0 ? (
        <Alert severity="warning">
          먼저 [메뉴 관리] 탭에서 메뉴를 등록해주세요.
        </Alert>
      ) : (
        <>
          {/* 목표 이익률 입력 */}
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

          {/* 메뉴별 추천가 카드 */}
          <Grid container spacing={2} mb={3}>
            {menuData.map((m) => (
              <Grid item xs={12} sm={6} key={m.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography fontWeight={700} mb={1}>
                    {m.name}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="baseline"
                    mb={1}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      원가
                    </Typography>
                    <Typography fontWeight={600}>
                      {fmt(Math.round(m.cost))}원
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="baseline"
                    mb={1}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      현재 판매가
                    </Typography>
                    <Typography>{fmt(m.sellingPrice)}원</Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="baseline"
                    mb={1}
                  >
                    <Typography fontSize={13} color="text.secondary">
                      현재 이익률
                    </Typography>
                    <Typography
                      fontWeight={600}
                      color={
                        m.currentRate >= 50
                          ? "success.main"
                          : m.currentRate >= 30
                            ? "warning.main"
                            : "error.main"
                      }
                    >
                      {pct(m.currentRate)}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 1,
                      pt: 1,
                      borderTop: "1px dashed #e0e0e0",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="baseline"
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={600}
                        color="primary"
                      >
                        추천 판매가 ({targetRate}%)
                      </Typography>
                      <Typography
                        fontWeight={700}
                        color="primary.main"
                        fontSize={18}
                      >
                        {m.recommendedPrice
                          ? `${fmt(m.recommendedPrice)}원`
                          : "—"}
                      </Typography>
                    </Box>
                    {m.diff !== null && (
                      <Typography
                        fontSize={12}
                        textAlign="right"
                        color={
                          m.diff > 0
                            ? "error.main"
                            : m.diff < 0
                              ? "success.main"
                              : "text.secondary"
                        }
                      >
                        {m.diff > 0
                          ? `현재보다 ${fmt(m.diff)}원 올려야 합니다`
                          : m.diff < 0
                            ? `현재보다 ${fmt(Math.abs(m.diff))}원 여유 있습니다`
                            : "현재 판매가와 동일합니다"}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* 구간별 비교 테이블 */}
          <Typography variant="subtitle2" mb={1}>
            이익률 구간별 판매가 비교
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>메뉴</TableCell>
                  <TableCell>원가</TableCell>
                  <TableCell>현재 판매가</TableCell>
                  {PRESETS.map((p) => (
                    <TableCell key={p} align="center">
                      {p}% 이익률
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {menuData.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <strong>{m.name}</strong>
                    </TableCell>
                    <TableCell>{fmt(Math.round(m.cost))}원</TableCell>
                    <TableCell>{fmt(m.sellingPrice)}원</TableCell>
                    {m.presetPrices.map((pp) => (
                      <TableCell
                        key={pp.rate}
                        align="center"
                        sx={{ fontWeight: 600 }}
                      >
                        {pp.price ? `${fmt(pp.price)}원` : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
