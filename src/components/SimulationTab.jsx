import { useState } from "react";
import { fmt, pct, calcMenuCost, profitRate } from "../utils/helpers";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Slider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
} from "@mui/material";

export default function SimulationTab({ menus, ingredients, fixedCost }) {
  const [priceChange, setPriceChange] = useState({});
  const [dailySales, setDailySales] = useState({});

  const fc = Number(fixedCost) || 0;

  const adjustedIngredients = ingredients.map((ing) => {
    const changePercent = Number(priceChange[ing.id]) || 0;
    return {
      ...ing,
      purchasePrice: ing.purchasePrice * (1 + changePercent / 100),
    };
  });

  const menuData = menus.map((m) => {
    const originalCost = calcMenuCost(m, ingredients);
    const newCost = calcMenuCost(m, adjustedIngredients);
    const profit = m.sellingPrice - newCost;
    const rate = profitRate(m.sellingPrice, newCost);
    const daily = Number(dailySales[m.id]) || 0;
    return {
      ...m,
      originalCost,
      newCost,
      profit,
      rate,
      daily,
      dailyProfit: profit * daily,
    };
  });

  const totalDailyProfit = menuData.reduce((s, m) => s + m.dailyProfit, 0);
  const totalMonthlyProfit = totalDailyProfit * 30;
  const netMonthly = totalMonthlyProfit - fc;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        재료 가격 변동과 예상 판매량을 입력해 수익을 시뮬레이션합니다.
      </Typography>

      {menus.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          먼저 [메뉴 관리] 탭에서 메뉴를 등록해주세요.
        </Alert>
      ) : (
        <>
          {/* 재료 가격 변동 */}
          <Typography variant="title1" mb={1}>
            재료 가격 변동
          </Typography>
          <Grid container spacing={2} mb={3}>
            {ingredients.map((ing) => {
              const val = Number(priceChange[ing.id]) || 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={ing.id}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <CardContent sx={{ p: 1 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography fontSize={13} fontWeight={600}>
                          {ing.name}
                        </Typography>
                        <Typography
                          fontSize={13}
                          fontWeight={700}
                          color={
                            val > 0
                              ? "error.main"
                              : val < 0
                                ? "success.main"
                                : "text.secondary"
                          }
                        >
                          {val > 0 ? "+" : ""}
                          {val}%
                        </Typography>
                      </Box>
                      <Slider
                        min={-50}
                        max={100}
                        value={val}
                        onChange={(e, v) =>
                          setPriceChange((p) => ({ ...p, [ing.id]: v }))
                        }
                        valueLabelDisplay="auto"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* 일 판매량 입력 */}
          <Typography variant="title1" mb={1}>
            일 예상 판매량
          </Typography>
          <Grid container spacing={2} mb={3}>
            {menus.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    sx={{ minWidth: 100 }}
                  >
                    {m.name}
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={dailySales[m.id] || ""}
                    onChange={(e) =>
                      setDailySales((p) => ({ ...p, [m.id]: e.target.value }))
                    }
                    placeholder="0"
                  />
                  <Typography fontSize={12} color="text.secondary">
                    개/일
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* 시뮬레이션 결과 */}
          <Typography variant="title1" mb={1}>
            시뮬레이션 결과
          </Typography>
          <Table component={Paper} size="small">
            <TableHead>
              <TableRow>
                <TableCell>메뉴</TableCell>
                <TableCell>기존 원가</TableCell>
                <TableCell>변동 원가</TableCell>
                <TableCell>변동폭</TableCell>
                <TableCell>이익률</TableCell>
                <TableCell>일 이익</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuData.map((m) => {
                const diff = m.newCost - m.originalCost;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <strong>{m.name}</strong>
                    </TableCell>
                    <TableCell>{fmt(Math.round(m.originalCost))}원</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {fmt(Math.round(m.newCost))}원
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color:
                          diff > 0
                            ? "error.main"
                            : diff < 0
                              ? "success.main"
                              : "text.secondary",
                      }}
                    >
                      {diff > 0 ? "+" : ""}
                      {fmt(Math.round(diff))}원
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color:
                          m.rate >= 50
                            ? "success.main"
                            : m.rate >= 30
                              ? "warning.main"
                              : "error.main",
                      }}
                    >
                      {pct(m.rate)}%
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {m.daily > 0
                        ? `${fmt(Math.round(m.dailyProfit))}원`
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 월 수익 요약 */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography fontSize={12}>일 총 이익</Typography>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  color={totalDailyProfit >= 0 ? "success.main" : "error.main"}
                >
                  {fmt(Math.round(totalDailyProfit))}원
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  원/일
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography fontSize={12}>월 총 이익</Typography>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  color={
                    totalMonthlyProfit >= 0 ? "success.main" : "error.main"
                  }
                >
                  {fmt(Math.round(totalMonthlyProfit))}원
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  원/월 (30일 기준)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography fontSize={12}>고정비 차감 후</Typography>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  color={netMonthly >= 0 ? "success.main" : "error.main"}
                >
                  {fmt(Math.round(netMonthly))}원
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  원/월
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* 경고/안내 */}
          {fc > 0 &&
            (netMonthly < 0 ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                ⚠️ 현재 판매량으로는 고정비를 충당하지 못합니다.{" "}
                <strong>{fmt(Math.abs(Math.round(netMonthly)))}원</strong>{" "}
                부족합니다.
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ 고정비를 충당하고{" "}
                <strong>{fmt(Math.round(netMonthly))}원</strong>의 순이익이
                예상됩니다.
              </Alert>
            ))}
        </>
      )}
    </Box>
  );
}
