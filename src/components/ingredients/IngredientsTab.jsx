import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IngredientForm from "./IngredientForm";
import { createColumns } from "./ingredientColumns";
import EmptyState from "../EmptyState";
export default function IngredientsTab({ ingredients, setIngredients }) {
  const handleAdd = useCallback(
    (ingredient) => {
      setIngredients((prev) => [...prev, ingredient]);
    },
    [setIngredients],
  );

  const handleRemove = useCallback(
    (id) => {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    },
    [setIngredients],
  );

  const columns = createColumns(handleRemove);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        구매 단위와 가격을 입력하면 기본 단위당 단가를 자동 계산합니다.
      </Typography>

      <IngredientForm onAdd={handleAdd} />

      {ingredients.length === 0 ? (
        <EmptyState
          message="등록된 재료가 없습니다"
          sub="위 입력 폼에서 재료를 추가해주세요"
        />
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={ingredients}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            hideFooter
            sx={{
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
