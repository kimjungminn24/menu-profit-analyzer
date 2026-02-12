import { useCallback } from "react";
import { uid } from "../../utils/helpers";
import { Box, Typography, Alert } from "@mui/material";
import EmptyState from "../EmptyState";
import MenuForm from "./MenuForm";
import MenuCard from "./MenuCard";

export default function MenuTab({ menus, setMenus, ingredients }) {
  const handleAddMenu = useCallback(
    (menu) => {
      setMenus((p) => [...p, menu]);
    },
    [setMenus],
  );

  const handleRemoveMenu = useCallback(
    (id) => {
      setMenus((p) => p.filter((m) => m.id !== id));
    },
    [setMenus],
  );

  const handleAddRecipe = useCallback(
    (menuId) => {
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
    },
    [setMenus, ingredients],
  );

  const handleUpdateRecipe = useCallback(
    (menuId, itemId, field, value) => {
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
    },
    [setMenus],
  );

  const handleRemoveRecipe = useCallback(
    (menuId, itemId) => {
      setMenus((p) =>
        p.map((m) =>
          m.id === menuId
            ? { ...m, recipe: m.recipe.filter((r) => r.id !== itemId) }
            : m,
        ),
      );
    },
    [setMenus],
  );

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

      <MenuForm onAdd={handleAddMenu} />

      {menus.length === 0 ? (
        <EmptyState
          message="등록된 메뉴가 없습니다"
          sub="위 입력 폼에서 메뉴를 추가해주세요"
        />
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              ingredients={ingredients}
              onAddRecipe={handleAddRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              onRemoveRecipe={handleRemoveRecipe}
              onRemoveMenu={handleRemoveMenu}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
