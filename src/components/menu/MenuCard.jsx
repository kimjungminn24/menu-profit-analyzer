import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fmt, pct, calcMenuCost, profitRate } from "../../utils/helpers";
import RecipeRow from "./RecipeRow";

export default function MenuCard({
  menu,
  ingredients,
  onAddRecipe,
  onUpdateRecipe,
  onRemoveRecipe,
  onRemoveMenu,
}) {
  const cost = calcMenuCost(menu, ingredients);
  const profit = menu.sellingPrice - cost;
  const rate = profitRate(menu.sellingPrice, cost);
  const monthlyRevenue = menu.sellingPrice * menu.monthlySales;
  const monthlyProfit = profit * menu.monthlySales;
  const marginRate = menu.sellingPrice ? profit / menu.sellingPrice : 0;

  return (
    <Accordion>
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
            판매가 {fmt(menu.sellingPrice)}원 / 원가 {fmt(Math.round(cost))}원 /
            이익 {fmt(Math.round(profit))}원 ({pct(rate)}%) / 월 매출{" "}
            {fmt(monthlyRevenue)}원 / 월 이익 {fmt(monthlyProfit)}원 / 마진{" "}
            {pct(marginRate)}%
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {menu.recipe.length === 0 && ingredients.length > 0 && (
          <Typography color="text.secondary" mb={1}>
            아직 레시피가 없습니다. 재료를 추가해주세요.
          </Typography>
        )}

        {menu.recipe.map((r) => (
          <RecipeRow
            key={r.id}
            recipe={r}
            ingredients={ingredients}
            onUpdate={(itemId, field, value) =>
              onUpdateRecipe(menu.id, itemId, field, value)
            }
            onRemove={(itemId) => onRemoveRecipe(menu.id, itemId)}
          />
        ))}

        <Box mt={1} display="flex" gap={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => onAddRecipe(menu.id)}
            disabled={ingredients.length === 0}
          >
            + 재료 추가
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onRemoveMenu(menu.id)}
          >
            메뉴 삭제
          </Button>
        </Box>

        {cost > menu.sellingPrice && (
          <Alert severity="error" sx={{ mt: 1 }}>
            ⚠️ 원가({fmt(Math.round(cost))}원)가 판매가(
            {fmt(menu.sellingPrice)}원)보다 높습니다! 팔수록 손해입니다.
          </Alert>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
