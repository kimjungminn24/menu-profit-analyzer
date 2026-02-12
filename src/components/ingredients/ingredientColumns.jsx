import { Button } from "@mui/material";
import { fmt, pct, TO_BASE, BASE_LBL } from "../../utils/helpers";

export const createColumns = (onRemove) => [
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
    valueGetter: (_, row) => `${fmt(row.purchaseQty)}${row.unit}`,
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
    headerName: "단위당 가격",
    flex: 1,
    valueGetter: (_, row) => {
      const base = row.purchaseQty * (TO_BASE[row.unit] || 1);
      return base > 0 ? row.purchasePrice / base : 0;
    },
    valueFormatter: (value, row) => `${pct(value)}원/${BASE_LBL[row.unit]}`,
    headerAlign: "right",
    align: "right",
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    width: 80,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => onRemove(params.row.id)}
      >
        삭제
      </Button>
    ),
  },
];
