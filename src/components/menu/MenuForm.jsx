import { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { uid } from "../../utils/helpers";

export default function MenuForm({ onAdd }) {
  const [menuName, setMenuName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [monthlySales, setMonthlySales] = useState("");

  const isValid = menuName.trim() && sellingPrice && Number(sellingPrice) > 0;

  const handleAdd = () => {
    if (!isValid) return;
    onAdd({
      id: uid(),
      name: menuName.trim(),
      sellingPrice: Number(sellingPrice),
      monthlySales: Number(monthlySales) || 0,
      recipe: [],
    });
    setMenuName("");
    setSellingPrice("");
    setMonthlySales("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <Grid container spacing={2} alignItems="end" mb={3}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="메뉴명"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
          fullWidth
          placeholder="100"
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!isValid}
          fullWidth
        >
          + 메뉴 추가
        </Button>
      </Grid>
    </Grid>
  );
}
