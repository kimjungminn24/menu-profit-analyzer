import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { uid, fmt, pct, UNITS, TO_BASE, BASE_LBL } from "../utils/helpers";

export default function IngredientsTab({ ingredients, setIngredients }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const add = () => {
    if (
      !name.trim() ||
      !qty ||
      !price ||
      Number(qty) <= 0 ||
      Number(price) <= 0
    )
      return;

    setIngredients((prev) => [
      ...prev,
      {
        id: uid(),
        name: name.trim(),
        unit,
        purchaseQty: Number(qty),
        purchasePrice: Number(price),
      },
    ]);

    setName("");
    setQty("");
    setPrice("");
  };

  const remove = (id) =>
    setIngredients((prev) => prev.filter((i) => i.id !== id));

  const columns = [
    {
      field: "name",
      headerName: "재료명",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "purchaseUnit",
      headerName: "무게/수량",
      flex: 1,
      valueGetter: (_, row) => `${row.purchaseQty}${row.unit}`,
      headerAlign: "right",
      align: "right",
    },

    {
      field: "purchasePrice",
      headerName: "가격",
      flex: 1,
      type: "number",
      valueFormatter: (_, row) =>
        row.purchasePrice ? `${fmt(row.purchasePrice)}원` : "0원",
      headerAlign: "right",
      align: "right",
    },

    {
      field: "unitPrice",
      headerName: "단위 당 가격",
      flex: 1,
      valueGetter: (_, row) => {
        const { purchaseQty, purchasePrice, unit } = row;
        const base = purchaseQty * (TO_BASE[unit] || 1);
        return base > 0 ? purchasePrice / base : 0;
      },
      valueFormatter: (value, row) => {
        const { unit } = row;
        return `${pct(value)}원/${BASE_LBL[unit]}`;
      },
      headerAlign: "right",
      align: "right",
    },

    {
      field: "actions",
      headerName: "",
      sortable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => remove(params.row.id)}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <div>
      <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>
        구매 단위와 가격을 입력하면 기본 단위당 단가를 자동 계산합니다.
      </p>

      {/* 입력 영역 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 90px 90px 120px auto",
          gap: 1,
          alignItems: "end",
          mb: 3,
        }}
      >
        <TextField
          label="재료명"
          variant="outlined"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormControl size="small">
          <InputLabel>단위</InputLabel>
          <Select
            value={unit}
            label="단위"
            onChange={(e) => setUnit(e.target.value)}
          >
            {UNITS.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="수량"
          type="number"
          size="small"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <TextField
          label="가격(원)"
          type="number"
          size="small"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Button variant="contained" onClick={add}>
          + 추가
        </Button>
      </Box>

      {/* 데이터 그리드 */}
      {ingredients.length === 0 ? (
        <div className="empty">등록된 재료가 없습니다</div>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={ingredients}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            checkboxSelection={false}
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
    </div>
  );
}
