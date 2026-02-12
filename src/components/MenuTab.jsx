import { useState } from "react";
import {
  uid,
  fmt,
  pct,
  calcMenuCost,
  profitRate,
  BASE_LBL,
} from "../utils/helpers";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MenuTab({ menus, setMenus, ingredients }) {
  const [menuName, setMenuName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [monthlySales, setMonthlySales] = useState(""); // 🌟 월 판매량 추가

  const addMenu = () => {
    if (!menuName.trim() || !sellingPrice || Number(sellingPrice) <= 0) return;
    const m = {
      id: uid(),
      name: menuName.trim(),
      sellingPrice: Number(sellingPrice),
      monthlySales: Number(monthlySales) || 0, // 🌟 초기값
      recipe: [],
    };
    setMenus((p) => [...p, m]);
    setMenuName("");
    setSellingPrice("");
    setMonthlySales("");
  };

  const removeMenu = (id) => setMenus((p) => p.filter((m) => m.id !== id));

  const addRecipeItem = (menuId) => {
    if (!ingredients.length) return;
    setMenus((p) =>
      p.map((m) =>
        m.id === menuId
          ? {
              ...m,
              recipe: [
                ...m.recipe,
                { id: uid(), ingredientId: ingredients[0].id, amount: 0 },
              ],
            }
          : m,
      ),
    );
  };

  const updateRecipeItem = (menuId, itemId, field, value) => {
    setMenus((p) =>
      p.map((m) =>
        m.id === menuId
          ? {
              ...m,
              recipe: m.recipe.map((r) =>
                r.id === itemId
                  ? {
                      ...r,
                      [field]: field === "amount" ? Number(value) : value,
                    }
                  : r,
              ),
            }
          : m,
      ),
    );
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        메뉴를 등록하고 레시피, 월 예상 판매량을 설정하면 원가와 월 손익을 자동
        산출합니다.
      </Typography>

      {ingredients.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          먼저 [재료 관리] 탭에서 재료를 등록해주세요.
        </Alert>
      )}

      {/* 메뉴 입력 */}
      <Grid container spacing={2} alignItems="end" mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="메뉴명"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            fullWidth
            placeholder="예: 아보카도 샌드위치"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="판매가(원)"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            fullWidth
            placeholder="7000"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="월 예상 판매량"
            type="number"
            value={monthlySales}
            onChange={(e) => setMonthlySales(e.target.value)}
            fullWidth
            placeholder="100"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="contained" onClick={addMenu} fullWidth>
            + 메뉴 추가
          </Button>
        </Grid>
      </Grid>

      {menus.length === 0 ? (
        <Typography color="text.secondary">등록된 메뉴가 없습니다</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {menus.map((menu) => {
            const cost = calcMenuCost(menu, ingredients);
            const profit = menu.sellingPrice - cost;
            const rate = profitRate(menu.sellingPrice, cost);

            // 🌟 월 순이익, 월 매출, 마진율 계산
            const monthlyRevenue = menu.sellingPrice * menu.monthlySales;
            const monthlyProfit = profit * menu.monthlySales;
            const marginRate = menu.sellingPrice
              ? profit / menu.sellingPrice
              : 0;

            return (
              <Accordion key={menu.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography fontWeight={600}>{menu.name}</Typography>
                    <Typography fontSize={13} color="text.secondary">
                      판매가 {fmt(menu.sellingPrice)}원 / 원가{" "}
                      {fmt(Math.round(cost))}원 / 이익 {fmt(Math.round(profit))}
                      원 ({pct(rate)}%) / 월 매출 {fmt(monthlyRevenue)}원 / 월
                      이익 {fmt(monthlyProfit)}원 / 마진 {pct(marginRate)}%
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {menu.recipe.length === 0 && ingredients.length > 0 && (
                    <Typography color="text.secondary" mb={1}>
                      아직 레시피가 없습니다. 재료를 추가해주세요.
                    </Typography>
                  )}

                  {menu.recipe.map((r) => {
                    const ing = ingredients.find(
                      (i) => i.id === r.ingredientId,
                    );
                    const unitLabel = ing ? BASE_LBL[ing.unit] : "";
                    return (
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        key={r.id}
                        mb={1}
                      >
                        <Grid item xs={5}>
                          <FormControl fullWidth size="small">
                            <InputLabel>재료</InputLabel>
                            <Select
                              value={r.ingredientId}
                              label="재료"
                              onChange={(e) =>
                                updateRecipeItem(
                                  menu.id,
                                  r.id,
                                  "ingredientId",
                                  e.target.value,
                                )
                              }
                            >
                              {ingredients.map((i) => (
                                <MenuItem key={i.id} value={i.id}>
                                  {i.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            type="number"
                            value={r.amount || ""}
                            onChange={(e) =>
                              updateRecipeItem(
                                menu.id,
                                r.id,
                                "amount",
                                e.target.value,
                              )
                            }
                            placeholder="사용량"
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <Typography>{unitLabel}</Typography>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={() => removeRecipeItem(menu.id, r.id)}
                          >
                            ✕
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  })}

                  <Box mt={1} display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => addRecipeItem(menu.id)}
                      disabled={ingredients.length === 0}
                    >
                      + 재료 추가
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => removeMenu(menu.id)}
                    >
                      메뉴 삭제
                    </Button>
                  </Box>

                  {cost > menu.sellingPrice && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      ⚠️ 원가({fmt(Math.round(cost))}원)가 판매가(
                      {fmt(menu.sellingPrice)}원)보다 높습니다! 팔수록
                      손해입니다.
                    </Alert>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
