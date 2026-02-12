import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
} from "@mui/material";
import { fmt } from "../../utils/helpers";

export default function BepTable({ menuData, fixedCost, bep }) {
  const fc = Number(fixedCost) || 0;
  if (fc <= 0) return null;

  const sorted = [...menuData].sort((a, b) => b.rate - a.rate);

  return (
    <>
      <Typography variant="subtitle2" mb={1}>
        메뉴별 손익분기점
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>메뉴</TableCell>
              <TableCell>판매가</TableCell>
              <TableCell>원가</TableCell>
              <TableCell>개당 이익</TableCell>
              <TableCell>손익분기 (월)</TableCell>
              <TableCell>손익분기 (일)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((m) => {
              const menuBep = m.profit > 0 ? Math.ceil(fc / m.profit) : null;
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <strong>{m.name}</strong>
                  </TableCell>
                  <TableCell>{fmt(m.sellingPrice)}원</TableCell>
                  <TableCell>{fmt(Math.round(m.cost))}원</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: m.profit >= 0 ? "success.main" : "error.main",
                    }}
                  >
                    {fmt(Math.round(m.profit))}원
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {menuBep !== null ? `${fmt(menuBep)}개` : "—"}
                  </TableCell>
                  <TableCell>
                    {menuBep !== null
                      ? `약 ${fmt(Math.ceil(menuBep / 30))}개/일`
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {bep !== null && (
        <Box mt={2}>
          <Alert severity="info">
            월 고정비 {fmt(fc)}원을 충당하기 위해서는{" "}
            <strong>{fmt(bep)}개</strong>를 판매해야 합니다.
          </Alert>
        </Box>
      )}
    </>
  );
}
