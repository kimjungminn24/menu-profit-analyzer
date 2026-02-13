import { useState, useCallback } from "react";
import { Box, Paper, Tabs, Tab, Typography, Button } from "@mui/material";
import IngredientsTab from "./components/ingredients/IngredientsTab";
import MenuTab from "./components/menu/MenuTab";
import AnalysisTab from "./components/analysis/AnalysisTab";
import PricingTab from "./components/pricing/PricingTab";
import { DEMO_INGREDIENTS, DEMO_MENUS } from "./data/demoData";

const TABS = [
  { key: "ingredients", label: "🧂 재료 관리" },
  { key: "menu", label: "🍔 메뉴 & 원가" },
  { key: "analysis", label: "📊 손익분석" },
  { key: "pricing", label: "🏷️ 가격 추천" },
];

export default function App() {
  const [tab, setTab] = useState("ingredients");
  const [ingredients, setIngredients] = useState([]);
  const [menus, setMenus] = useState([]);
  const [fixedCost, setFixedCost] = useState("3500000");

  const loadDemoData = useCallback(() => {
    setIngredients(DEMO_INGREDIENTS);
    setMenus(DEMO_MENUS);
  }, []);

  const resetData = useCallback(() => {
    setIngredients([]);
    setMenus([]);
    setFixedCost("3500000");
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", p: 4, maxWidth: 960, mx: "auto" }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          <span className="emoji">💰</span>마진계산기
        </Typography>
        <Typography variant="body2" color="text.secondary">
          팔수록 남는 메뉴 만들기 — 원가 분석부터 가격 설정까지
        </Typography>
      </Box>

      <Box mb={2} display="flex" gap={2}>
        <Button variant="contained" color="secondary" onClick={loadDemoData}>
          테스트 데이터 채우기
        </Button>
        <Button variant="outlined" color="inherit" onClick={resetData}>
          초기화
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map((t) => (
            <Tab
              key={t.key}
              label={<span className="emoji">{t.label}</span>}
              value={t.key}
            />
          ))}
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {tab === "ingredients" && (
          <IngredientsTab
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        )}
        {tab === "menu" && (
          <MenuTab
            menus={menus}
            setMenus={setMenus}
            ingredients={ingredients}
          />
        )}
        {tab === "analysis" && (
          <AnalysisTab
            menus={menus}
            ingredients={ingredients}
            fixedCost={fixedCost}
            setFixedCost={setFixedCost}
          />
        )}
        {tab === "pricing" && (
          <PricingTab menus={menus} ingredients={ingredients} />
        )}
      </Paper>

      <Box textAlign="center" mt={4} fontSize={12} color="text.secondary">
        팔수록 남는 메뉴 만들기 — 원가 분석부터 가격 설정까지
      </Box>
    </Box>
  );
}
