import { calcMenuCost, profitRate } from "../../utils/helpers";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import EmptyState from "../EmptyState";
import StatCards from "./StatCards";
import ProfitBarChart from "./ProfitBarChart";
import BepTable from "./BepTable";

export default function AnalysisTab({
  menus,
  ingredients,
  fixedCost,
  setFixedCost,
}) {
  const menuData = menus.map((m) => {
    const cost = calcMenuCost(m, ingredients);
    const profit = m.sellingPrice - cost;
    const rate = profitRate(m.sellingPrice, cost);
    return { ...m, cost, profit, rate };
  });

  const fc = Number(fixedCost) || 0;

  const totalCost = menuData.reduce((s, m) => s + m.cost, 0);
  const totalProfit = menuData.reduce((s, m) => s + m.profit, 0);
  const avgProfit = menuData.length > 0 ? totalProfit / menuData.length : 0;
  const avgRate =
    menuData.length > 0
      ? menuData.reduce((s, m) => s + m.rate, 0) / menuData.length
      : 0;

  const bep = avgProfit > 0 ? Math.ceil(fc / avgProfit) : null;

  if (menus.length === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          고정비를 입력하면 손익분기점을 계산하고, 메뉴별 이익률을 비교합니다.
        </Typography>
        <EmptyState
          message="등록된 메뉴가 없습니다"
          sub="먼저 [메뉴 관리] 탭에서 메뉴를 등록해주세요"
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        고정비를 입력하면 손익분기점을 계산하고, 메뉴별 이익률을 비교합니다.
      </Typography>

      <Box mb={3} maxWidth={300}>
        <TextField
          label="월 고정비"
          type="number"
          value={fixedCost}
          onChange={(e) => setFixedCost(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">원/월</InputAdornment>,
          }}
        />
      </Box>

      <StatCards
        menuCount={menus.length}
        totalCost={totalCost}
        totalProfit={totalProfit}
        avgRate={avgRate}
      />

      <ProfitBarChart menuData={menuData} />

      <BepTable menuData={menuData} fixedCost={fixedCost} bep={bep} />
    </Box>
  );
}
