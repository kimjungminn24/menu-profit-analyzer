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
import { uid, UNITS } from "../../utils/helpers";

export default function IngredientForm({ onAdd }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const isValid =
    name.trim() && qty && price && Number(qty) > 0 && Number(price) > 0;

  const handleAdd = () => {
    if (!isValid) return;

    onAdd({
      id: uid(),
      name: name.trim(),
      unit,
      purchaseQty: Number(qty),
      purchasePrice: Number(price),
    });

    setName("");
    setQty("");
    setPrice("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
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
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="예: 카다이프"
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
        onKeyDown={handleKeyDown}
        placeholder="1000"
      />

      <TextField
        label="가격(원)"
        type="number"
        size="small"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="15000"
      />

      <Button variant="contained" onClick={handleAdd} disabled={!isValid}>
        + 추가
      </Button>
    </Box>
  );
}
