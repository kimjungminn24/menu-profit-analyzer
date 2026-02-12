// 고유 ID 생성
export const uid = () => Math.random().toString(36).slice(2, 9);

// 숫자 포맷 (정수)
export const fmt = (n) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

// 숫자 포맷 (소수 1자리)
export const pct = (n) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: 1 });

// 단위 옵션
export const UNITS = ["g", "kg", "ml", "L", "개"];

// 기본 단위로 환산하는 배수
export const TO_BASE = { g: 1, kg: 1000, ml: 1, L: 1000, 개: 1 };

// 기본 단위 라벨
export const BASE_LBL = { g: "g", kg: "g", ml: "ml", L: "ml", 개: "개" };

// 메뉴 원가 계산
export function calcMenuCost(menu, ingredients) {
  let total = 0;
  for (const r of menu.recipe) {
    const ing = ingredients.find((i) => i.id === r.ingredientId);
    if (!ing) continue;
    const baseQty = ing.purchaseQty * TO_BASE[ing.unit];
    if (baseQty === 0) continue;
    const unitPrice = ing.purchasePrice / baseQty;
    total += unitPrice * r.amount;
  }
  return total;
}

// 이익률 계산
export function profitRate(sellingPrice, cost) {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - cost) / sellingPrice) * 100;
}
