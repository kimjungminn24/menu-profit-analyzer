import { useState, useMemo } from "react";
import { calcMenuCost, profitRate } from "../../utils/helpers";
import { Box, Typography } from "@mui/material";
import EmptyState from "../EmptyState";
import TargetRateInput from "./TargetRateInput";
import PricingCards from "./PricingCards";
import PresetCompareTable from "./PresetCompareTable";

const PRESETS = [30, 50, 70];

export default function PricingTab({ menus, ingredients }) {
  const [targetRate, setTargetRate] = useState(50);

  const menuData = useMemo(
    () =>
      menus.map((m) => {
        const cost = calcMenuCost(m, ingredients);
        const currentRate = profitRate(m.sellingPrice, cost);
        const recommendedPrice =
          targetRate < 100 ? Math.ceil(cost / (1 - targetRate / 100)) : null;
        const diff = recommendedPrice
          ? recommendedPrice - m.sellingPrice
          : null;

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
      }),
    [menus, ingredients, targetRate],
  );

  if (menus.length === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          목표 이익률을 설정하면 메뉴별 적정 판매가를 역산합니다.
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
        목표 이익률을 설정하면 메뉴별 적정 판매가를 역산합니다.
      </Typography>

      <TargetRateInput targetRate={targetRate} setTargetRate={setTargetRate} />
      <PricingCards menuData={menuData} targetRate={targetRate} />
      <PresetCompareTable menuData={menuData} />
    </Box>
  );
}
