import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { BASE_LBL } from "../../utils/helpers";

export default function RecipeRow({ recipe, ingredients, onUpdate, onRemove }) {
  const ing = ingredients.find((i) => i.id === recipe.ingredientId);
  const unitLabel = ing ? BASE_LBL[ing.unit] : "";

  return (
    <Grid container spacing={1} alignItems="center" mb={1}>
      <Grid item xs={5}>
        <FormControl fullWidth size="small">
          <InputLabel>재료</InputLabel>
          <Select
            value={recipe.ingredientId}
            label="재료"
            onChange={(e) =>
              onUpdate(recipe.id, "ingredientId", e.target.value)
            }
          >
            {ingredients.map((i) => (
              <MenuItem key={i.id} value={i.id}>
                {i.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          value={recipe.amount || ""}
          onChange={(e) => onUpdate(recipe.id, "amount", e.target.value)}
          placeholder="사용량"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: <Typography>{unitLabel}</Typography>,
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={() => onRemove(recipe.id)}
        >
          ✕
        </Button>
      </Grid>
    </Grid>
  );
}
