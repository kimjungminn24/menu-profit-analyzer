import { fmt, pct, calcMenuCost, profitRate } from "../utils/helpers";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
} from "@mui/material";
export default function AnalysisTab({
  menus,
  ingredients,
  fixedCost,
  setFixedCost,
}) {
  // 1. 메뉴별 원가, 이익, 이익률 계산
  const menuData = menus.map((m) => {
    const cost = calcMenuCost(m, ingredients);
    const profit = m.sellingPrice - cost;
    const rate = profitRate(m.sellingPrice, cost);
    return { ...m, cost, profit, rate };
  });

  const fc = Number(fixedCost) || 0;

  // 2. 통계 계산
  const totalCost = menuData.reduce((s, m) => s + m.cost, 0);
  const totalProfit = menuData.reduce((s, m) => s + m.profit, 0);
  const avgProfit = menuData.length > 0 ? totalProfit / menuData.length : 0;
  const avgRate =
    menuData.length > 0
      ? menuData.reduce((s, m) => s + m.rate, 0) / menuData.length
      : 0;

  // 3. 총 손익분기점 (월)
  const bep = avgProfit > 0 ? Math.ceil(fc / avgProfit) : null;

  const sorted = [...menuData].sort((a, b) => b.rate - a.rate);
  const maxRate =
    sorted.length > 0 ? Math.max(...sorted.map((m) => m.rate), 1) : 1;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        고정비를 입력하면 손익분기점을 계산하고, 메뉴별 이익률을 비교합니다.
      </Typography>

      {menus.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          먼저 [메뉴 관리] 탭에서 메뉴를 등록해주세요.
        </Alert>
      ) : (
        <>
          {/* 고정비 입력 */}
          <Box mb={3} maxWidth={300}>
            <TextField
              label="월 고정비"
              type="number"
              value={fixedCost}
              onChange={(e) => setFixedCost(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">원/월</InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 요약 통계 */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="caption">메뉴 수</Typography>
                <Typography variant="h6">{menus.length}</Typography>
                <Typography variant="body2">개</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="caption">총 원가</Typography>
                <Typography variant="h6">
                  {fmt(Math.round(totalCost))}
                </Typography>
                <Typography variant="body2">원</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="caption">총 이익</Typography>
                <Typography
                  variant="h6"
                  color={totalProfit >= 0 ? "success.main" : "error.main"}
                >
                  {fmt(Math.round(totalProfit))}
                </Typography>
                <Typography variant="body2">원/개</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="caption">평균 이익률</Typography>
                <Typography variant="h6">{pct(avgRate)}%</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* 메뉴별 이익률 바 차트 */}
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
                      backgroundColor:
                        m.rate >= 50
                          ? "#16a34a"
                          : m.rate >= 30
                            ? "#d97706"
                            : "#dc2626",
                    },
                  }}
                />
                <Typography
                  sx={{ width: 80, textAlign: "right", fontWeight: 600 }}
                >
                  +{fmt(Math.round(m.profit))}원
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 메뉴별 손익분기 테이블 */}
          {fc > 0 && (
            <>
              <Typography variant="subtitle2" mb={1}>
                메뉴별 손익분기점
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>메뉴</TableCell>
                      <TableCell>판매가</TableCell>
                      <TableCell>원가</TableCell>
                      <TableCell>개당 이익</TableCell>
                      <TableCell>손익분기 (월)</TableCell>
                      <TableCell>손익분기 (일)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sorted.map((m) => {
                      const menuBep =
                        m.profit > 0 ? Math.ceil(fc / m.profit) : null;
                      return (
                        <TableRow key={m.id}>
                          <TableCell>
                            <strong>{m.name}</strong>
                          </TableCell>
                          <TableCell>{fmt(m.sellingPrice)}원</TableCell>
                          <TableCell>{fmt(Math.round(m.cost))}원</TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color:
                                m.profit >= 0 ? "success.main" : "error.main",
                            }}
                          >
                            {fmt(Math.round(m.profit))}원
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            {menuBep !== null ? `${fmt(menuBep)}개` : "—"}
                          </TableCell>
                          <TableCell>
                            {menuBep !== null
                              ? `약 ${fmt(Math.ceil(menuBep / 30))}개/일`
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* 총 손익분기 요약 */}
              {bep !== null && (
                <Box mt={2}>
                  <Alert severity="info">
                    ⚡ 월 고정비 {fmt(fc)}원을 충당하기 위해서는{" "}
                    <strong>{fmt(bep)}개</strong>를 판매해야 합니다.
                  </Alert>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
