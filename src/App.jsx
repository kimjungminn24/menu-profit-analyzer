import { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Button } from "@mui/material";
import IngredientsTab from "./components/IngredientsTab";
import MenuTab from "./components/MenuTab";
import AnalysisTab from "./components/AnalysisTab";
import SimulationTab from "./components/SimulationTab";

const TABS = [
  { key: "ingredients", label: "🧂 재료 관리" },
  { key: "menu", label: "🍔 메뉴 & 원가" },
  { key: "analysis", label: "📊 손익분석" },
  { key: "simulation", label: "🏷️ 시뮬레이션" },
];

const DEMO_INGREDIENTS_TEST = [
  {
    id: "ing1",
    name: "카다이프",
    unit: "g",
    purchaseQty: 1000,
    purchasePrice: 15000, // 테스트용 적당한 1kg 가격
  },
  {
    id: "ing2",
    name: "피스타치오 페이스트",
    unit: "g",
    purchaseQty: 500,
    purchasePrice: 25000, // 페이스트라 비싸게
  },
  {
    id: "ing3",
    name: "화이트 커버춰 초콜릿",
    unit: "g",
    purchaseQty: 500,
    purchasePrice: 24000,
  },
  {
    id: "ing4",
    name: "버터 (무염)",
    unit: "g",
    purchaseQty: 454,
    purchasePrice: 7000,
  },
  {
    id: "ing5",
    name: "마시멜로",
    unit: "g",
    purchaseQty: 1000,
    purchasePrice: 12000,
  },
  {
    id: "ing6",
    name: "코코아 파우더",
    unit: "g",
    purchaseQty: 500,
    purchasePrice: 14000,
  },
  {
    id: "ing7",
    name: "탈지분유",
    unit: "g",
    purchaseQty: 500,
    purchasePrice: 10000,
  },
  {
    id: "ing8",
    name: "식용유 (작업용)",
    unit: "ml",
    purchaseQty: 1000,
    purchasePrice: 8000,
  },
];

const DEMO_MENUS_TEST = [
  {
    id: "menu1",
    name: "두바이 쫀득 쿠키",
    sellingPrice: 50000,
    monthlySales: 10,
    recipe: [
      { id: "r1", ingredientId: "ing1", amount: 140 }, // 카다이프
      { id: "r2", ingredientId: "ing2", amount: 145 }, // 피스타치오 페이스트
      { id: "r3", ingredientId: "ing3", amount: 55 }, // 화이트 초콜릿
      { id: "r4", ingredientId: "ing4", amount: 45 }, // 버터
      { id: "r5", ingredientId: "ing5", amount: 1 },
      { id: "r6", ingredientId: "ing6", amount: 5 },

      { id: "r7", ingredientId: "ing7", amount: 175 }, // 마시멜로
      { id: "r8", ingredientId: "ing4", amount: 25 }, // 버터 추가
      { id: "r9", ingredientId: "ing8", amount: 15 }, // 코코아 파우더
      { id: "r10", ingredientId: "ing9", amount: 15 }, // 탈지분유
    ],
  },
];

export default function App() {
  const [tab, setTab] = useState("ingredients");
  const [ingredients, setIngredients] = useState([]);
  const [menus, setMenus] = useState([]);
  const [fixedCost, setFixedCost] = useState("3500000");

  return (
    <Box sx={{ minHeight: "100vh", p: 4, maxWidth: 960, mx: "auto" }}>
      {/* 헤더 */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          <span class="emoji">💰</span>원가 & 가성비 계산기
        </Typography>
        <Typography variant="body2" color="text.secondary">
          소규모 자영업자를 위한 메뉴별 원가 분석, 손익분기점, 가성비 비교 도구
        </Typography>
      </Box>
      <Box mb={2} display="flex" gap={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setIngredients(DEMO_INGREDIENTS_TEST);
            setMenus(DEMO_MENUS_TEST);
          }}
        >
          테스트 데이터 채우기
        </Button>
      </Box>

      {/* 탭 네비게이션 */}
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
              label={<span class="emoji">{t.label}</span>}
              value={t.key}
            />
          ))}
        </Tabs>
      </Paper>

      {/* 콘텐츠 카드 */}
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
        {tab === "simulation" && (
          <SimulationTab
            menus={menus}
            ingredients={ingredients}
            fixedCost={fixedCost}
          />
        )}
      </Paper>

      {/* 푸터 */}
      <Box textAlign="center" mt={4} fontSize={12} color="text.secondary">
        원가 & 가성비 계산기 · 소규모 자영업자를 위한 도구
      </Box>
    </Box>
  );
}
