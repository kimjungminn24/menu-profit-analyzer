import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { fmt } from "../../utils/helpers";

const PRESETS = [30, 50, 70];

export default function PresetCompareTable({ menuData }) {
  return (
    <>
      <Typography variant="subtitle2" mb={1}>
        이익률 구간별 판매가 비교
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>메뉴</TableCell>
              <TableCell>원가</TableCell>
              <TableCell>현재 판매가</TableCell>
              {PRESETS.map((p) => (
                <TableCell key={p} align="center">
                  {p}% 이익률
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <strong>{m.name}</strong>
                </TableCell>
                <TableCell>{fmt(Math.round(m.cost))}원</TableCell>
                <TableCell>{fmt(m.sellingPrice)}원</TableCell>
                {m.presetPrices.map((pp) => (
                  <TableCell
                    key={pp.rate}
                    align="center"
                    sx={{ fontWeight: 600 }}
                  >
                    {pp.price ? `${fmt(pp.price)}원` : "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
