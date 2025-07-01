import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useData } from "../context/DataContext";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  Stack,
  useTheme
} from "@mui/material";
import { Assessment, TableChart, DataArray, ErrorOutline } from "@mui/icons-material";
import NLQPanel from "./NLQPanel";

// ---- EDA Numeric Summary Helper ----
function getNumericSummary(columns, data) {
  if (!columns || !data || !data.length) return [];
  const stats = [];
  columns.forEach((col, colIdx) => {
    const nums = data
      .map(row => parseFloat(row[colIdx]))
      .filter(v => !isNaN(v));
    if (nums.length) {
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;
      const std = Math.sqrt(nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length);
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      stats.push({
        name: col,
        count: nums.length,
        mean,
        std,
        min,
        max,
      });
    }
  });
  return stats;
}

// ---- EDA Column Types Helper ----
function getColumnTypes(columns, data) {
  if (!columns || !data || !data.length) return [];
  return columns.map((col, idx) => {
    let nums = 0, total = 0;
    for (const row of data) {
      total++;
      if (!isNaN(parseFloat(row[idx])) && row[idx] !== "") nums++;
    }
    if (total === 0) return "Unknown";
    if (nums / total > 0.8) return "Numeric";
    if (total - nums > 0) return "Text";
    return "Unknown";
  });
}

// ---- Missing Values Helper ----
function getMissingCounts(columns, data) {
  if (!columns || !data) return [];
  return columns.map((col, idx) =>
    data.filter(row => row[idx] == null || row[idx] === "").length
  );
}

// ---- Main EDA Summary Component ----
export default function EDASummary() {
  const theme = useTheme();
  const { columns = [], data = [], nlqAnswer = "" } = useData() || {};

  // Defensive: if not loaded yet
  if (!columns.length || !data.length) {
    return (
      <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          No data available. Please upload the dataset first.
        </Typography>
      </Card>
    );
  }

  // --- Memoized calculations for efficiency
  const nRows = data.length;
  const nCols = columns.length;
  const colTypes = useMemo(() => getColumnTypes(columns, data), [columns, data]);
  const missingCounts = useMemo(() => getMissingCounts(columns, data), [columns, data]);
  const numericStats = useMemo(() => getNumericSummary(columns, data), [columns, data]);
  const nMissing = missingCounts.reduce((a, b) => a + b, 0);

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        boxShadow: "0 2px 16px #fae0aa22",
        borderRadius: 4,
        mb: 6,
        p: 0,
        background: theme.palette.mode === "dark" ? "#1c2025" : "#fff"
      }}
      aria-label="EDA Summary"
    >
      <CardHeader
        avatar={<Assessment sx={{ color: "#fa8000", fontSize: 36 }} aria-label="EDA" />}
        title={
          <Typography variant="h5" fontWeight={800} color="#fa8000" letterSpacing={1}>
            EDA & Interpretation
          </Typography>
        }
        sx={{ pb: 0, pt: 3, px: 3 }}
      />
      <CardContent sx={{ pb: 0, pt: 1 }}>
        <Divider sx={{ mb: 2 }} />
        {/* EDA Basic Stats */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1c4587",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <TableChart fontSize="small" /> Rows
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {nRows}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1c4587",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <DataArray fontSize="small" /> Columns
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {nCols}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1c4587",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <ErrorOutline fontSize="small" /> Missing
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {nMissing === 0 ? "None" : nMissing}
            </Typography>
          </Box>
        </Stack>
        {/* Column Details Table */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Columns
        </Typography>
        <Box sx={{ maxHeight: 260, overflow: "auto", mb: 3 }}>
          <Table size="small" aria-label="Columns Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Missing</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {columns.map((col, i) => (
                <TableRow key={col}>
                  <TableCell>
                    <Tooltip title={col}>
                      <Typography sx={{ fontWeight: 700, color: "#fa8000" }}>
                        {col}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={colTypes[i]}
                      color={colTypes[i] === "Numeric" ? "success" : "default"}
                      variant="outlined"
                      size="small"
                      aria-label={colTypes[i]}
                    />
                  </TableCell>
                  <TableCell>
                    {missingCounts[i] === 0 ? (
                      <Chip label="None" color="success" size="small" aria-label="None" />
                    ) : (
                      <Chip
                        label={missingCounts[i]}
                        color="warning"
                        size="small"
                        aria-label={`Missing: ${missingCounts[i]}`}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        {/* Numeric Stats Table */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Numeric Column Stats
        </Typography>
        <Box sx={{ maxHeight: 260, overflow: "auto", mb: 3 }}>
          {numericStats.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No numeric columns detected.
            </Typography>
          ) : (
            <Table size="small" aria-label="Numeric Stats Table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Column</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Count</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mean</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Std</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Min</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Max</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {numericStats.map(s => (
                  <TableRow key={s.name}>
                    <TableCell sx={{ fontWeight: 700, color: "#fa8000" }}>
                      {s.name}
                    </TableCell>
                    <TableCell>{s.count}</TableCell>
                    <TableCell>
                      {s.mean.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      {s.std.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>{s.min}</TableCell>
                    <TableCell>{s.max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        {/* Natural Language Q&A Panel */}
        <Divider sx={{ my: 3 }} />
        <NLQPanel />
        {/* Last Q&A for Export */}
        {nlqAnswer && (
          <Box
            sx={{
              mt: 2,
              bgcolor: "#f7fbff",
              p: 2,
              borderRadius: 1,
              border: "1px solid #b3e5fc"
            }}
          >
            <Typography fontWeight={700} color="#1c4587">
              Latest Q&A for Export:
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {nlqAnswer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ---- PropTypes for documentation & safety
EDASummary.propTypes = {
  // Provided by useData() context; no external props required.
};
