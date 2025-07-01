import React, { useState, useMemo, useEffect, useRef } from "react";
import { useData } from "../context/DataContext";
import {
  Box, Typography, MenuItem, Select, Button, Card, CardContent, CardHeader, Divider, Stack, Accordion, AccordionSummary, AccordionDetails, Alert, Menu, MenuItem as MuiMenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  InsertChart, ScatterPlot, PieChart as PieChartIcon, BarChart as BarChartIcon, Timeline, BubbleChart, Download as DownloadIcon, PictureAsPdf, Slideshow
} from "@mui/icons-material";
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

// ========== Helper Functions ==========
function getNumericColumns(data, columns) {
  if (!columns || !data?.length) return [];
  return columns.filter((col, idx) =>
    data.every(row => !isNaN(parseFloat(row[idx])) && row[idx] !== undefined && row[idx] !== null && row[idx] !== "")
  );
}
function getCategoricalColumns(data, columns) {
  if (!columns || !data?.length) return [];
  return columns.filter((col, idx) =>
    !data.every(row => !isNaN(parseFloat(row[idx])))
  );
}
function getDateColumns(data, columns) {
  if (!columns || !data?.length) return [];
  // Heuristic: checks for ISO date/datetime strings in first 10 rows
  return columns.filter((col, idx) =>
    data.slice(0, 10).every(row =>
      typeof row[idx] === "string" && !isNaN(Date.parse(row[idx]))
    )
  );
}
function toChartData(data, columns, xAxis, yAxis) {
  if (!data?.length || !columns?.length || !xAxis || !yAxis) return [];
  const xIdx = columns.indexOf(xAxis);
  const yIdx = columns.indexOf(yAxis);
  if (xIdx === -1 || yIdx === -1) return [];
  return data.map(row => ({
    x: row[xIdx],
    y: Number(row[yIdx]),
  })).filter(item => !isNaN(item.y));
}
function toPieData(data, columns, pieCategory, pieValue) {
  if (!data?.length || !columns?.length || !pieCategory || !pieValue) return [];
  const catIdx = columns.indexOf(pieCategory);
  const valIdx = columns.indexOf(pieValue);
  if (catIdx === -1 || valIdx === -1) return [];
  const group = {};
  data.forEach(row => {
    const key = row[catIdx];
    const value = Number(row[valIdx]);
    if (key && !isNaN(value)) {
      group[key] = (group[key] || 0) + value;
    }
  });
  return Object.entries(group).map(([name, value]) => ({ name, value }));
}
function toPieDataByCount(data, columns, pieCategory) {
  if (!data?.length || !columns?.length || !pieCategory) return [];
  const catIdx = columns.indexOf(pieCategory);
  if (catIdx === -1) return [];
  const group = {};
  data.forEach(row => {
    const key = row[catIdx];
    if (key) group[key] = (group[key] || 0) + 1;
  });
  return Object.entries(group).map(([name, value]) => ({ name, value }));
}
function toRadarData(data, columns, radarCategory, radarValue) {
  return toPieData(data, columns, radarCategory, radarValue);
}
const PIE_COLORS = ["#fa8000", "#fabe3b", "#1c4587", "#91d3f3", "#ffb74d", "#689f38", "#c62828"];

// ========== Export Buttons ==========
function ExportChartButton({ chartRef, filename = "chart.png" }) {
  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<DownloadIcon />}
      sx={{ ml: 2, mt: -1 }}
      onClick={handleExport}
    >
      Export PNG
    </Button>
  );
}

function DownloadDataButton({ data, columns, filename = "data" }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const exportData = (type) => {
    const ws = XLSX.utils.json_to_sheet(
      data.map(row =>
        Object.fromEntries(columns.map((col, idx) => [col, row[idx]]))
      )
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    if (type === "csv") {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      saveAs(blob, `${filename}.csv`);
    } else {
      XLSX.writeFile(wb, `${filename}.xlsx`);
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<DownloadIcon />}
        onClick={handleClick}
        sx={{ ml: 2, mt: -1 }}
      >
        Download Data
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <MuiMenuItem onClick={() => exportData("csv")}>CSV</MuiMenuItem>
        <MuiMenuItem onClick={() => exportData("xlsx")}>Excel (XLSX)</MuiMenuItem>
      </Menu>
    </>
  );
}

// ========== Export All to PDF/PPT ==========
async function exportChartsToPDF(chartRefs, filename = "charts.pdf") {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  let pageAdded = false;
  for (let i = 0; i < chartRefs.length; i++) {
    const chart = chartRefs[i];
    if (chart.current) {
      const canvas = await html2canvas(chart.current);
      const imgData = canvas.toDataURL("image/png");
      if (pageAdded) pdf.addPage();
      pdf.addImage(imgData, "PNG", 40, 60, 700, 380); // adjust as needed
      pageAdded = true;
    }
  }
  pdf.save(filename);
}
async function exportChartsToPPT(chartRefs, filename = "charts.pptx") {
  const pptx = new PptxGenJS();
  for (let ref of chartRefs) {
    if (ref.current) {
      const canvas = await html2canvas(ref.current);
      const imgData = canvas.toDataURL("image/png");
      const slide = pptx.addSlide();
      slide.addImage({ data: imgData, x: 0.5, y: 0.5, w: 9, h: 5 });
    }
  }
  await pptx.writeFile({ fileName: filename });
}

// ========== Main Component ==========
export default function ChartBuilder() {
  // DataContext
  const { columns: rawColumns, data: rawData } = useData() || {};
  const columns = Array.isArray(rawColumns) ? rawColumns : [];
  const data = Array.isArray(rawData) ? rawData : [];

  // Detect columns
  const numericColumns = useMemo(() => getNumericColumns(data, columns), [columns, data]);
  const categoricalColumns = useMemo(() => getCategoricalColumns(data, columns), [columns, data]);
  const dateColumns = useMemo(() => getDateColumns(data, columns), [columns, data]);

  // Chart UI State
  const [chartType, setChartType] = useState("Scatter");
  const [xAxis, setXAxis] = useState(columns[0] || "");
  const [yAxis, setYAxis] = useState(numericColumns[0] || columns[1] || "");
  const [pieCategory, setPieCategory] = useState(categoricalColumns[0] || "");
  const [pieValue, setPieValue] = useState(numericColumns[0] || "");
  const [radarCategory, setRadarCategory] = useState(categoricalColumns[0] || "");
  const [radarValue, setRadarValue] = useState(numericColumns[0] || "");
  const [show, setShow] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  // Chart Data
  const chartData = useMemo(() => toChartData(data, columns, xAxis, yAxis), [data, columns, xAxis, yAxis]);
  const pieData = useMemo(() => toPieData(data, columns, pieCategory, pieValue), [data, columns, pieCategory, pieValue]);
  const radarData = useMemo(() => toRadarData(data, columns, radarCategory, radarValue), [data, columns, radarCategory, radarValue]);

  // Sync axes to column changes
  useEffect(() => {
    if (!columns.includes(xAxis)) setXAxis(columns[0] || "");
    if (!numericColumns.includes(yAxis)) setYAxis(numericColumns[0] || columns[1] || "");
    if (!categoricalColumns.includes(pieCategory)) setPieCategory(categoricalColumns[0] || "");
    if (!numericColumns.includes(pieValue)) setPieValue(numericColumns[0] || "");
    if (!categoricalColumns.includes(radarCategory)) setRadarCategory(categoricalColumns[0] || "");
    if (!numericColumns.includes(radarValue)) setRadarValue(numericColumns[0] || "");
  }, [columns, numericColumns, categoricalColumns]);

  // For exporting: track all chart refs in the dashboard
  const dashboardChartRefs = useRef([]);
  dashboardChartRefs.current = [];

  // Main chart ref (for export)
  const mainChartRef = useRef();

  // Render chart controls
  function renderControls() {
    if (!columns.length) return null;
    switch (chartType) {
      case "Scatter":
      case "Bar":
      case "Line":
      case "Area":
        return (
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>X Axis</Typography>
              <Select value={xAxis} onChange={e => setXAxis(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {columns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Y Axis</Typography>
              <Select value={yAxis} onChange={e => setYAxis(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {numericColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        );
      case "Pie":
        return (
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Category</Typography>
              <Select value={pieCategory} onChange={e => setPieCategory(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {categoricalColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Value</Typography>
              <Select value={pieValue} onChange={e => setPieValue(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {numericColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        );
      case "Radar":
        return (
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Category</Typography>
              <Select value={radarCategory} onChange={e => setRadarCategory(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {categoricalColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Value</Typography>
              <Select value={radarValue} onChange={e => setRadarValue(e.target.value)} size="small"
                sx={{ minWidth: 150, borderRadius: 2, fontWeight: 600 }}>
                {numericColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        );
      default: return null;
    }
  }

  // Main chart renderer (with export button)
  function renderChart() {
    let chartEl = null;
    if (chartType === "Scatter" && chartData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 24, right: 16, left: 16, bottom: 24 }}>
            <CartesianGrid />
            <XAxis dataKey="x" name={xAxis} tick={{ fontSize: 13 }} />
            <YAxis dataKey="y" name={yAxis} tick={{ fontSize: 13 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={yAxis} data={chartData} fill="#fa8000" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    if (chartType === "Bar" && chartData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ top: 24, right: 16, left: 16, bottom: 24 }}>
            <CartesianGrid />
            <XAxis dataKey="x" name={xAxis} tick={{ fontSize: 13 }} />
            <YAxis name={yAxis} tick={{ fontSize: 13 }} />
            <Tooltip />
            <Bar dataKey="y" fill="#fa8000" />
          </BarChart>
        </ResponsiveContainer>
      );
    if (chartType === "Line" && chartData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 24, right: 16, left: 16, bottom: 24 }}>
            <CartesianGrid />
            <XAxis dataKey="x" name={xAxis} tick={{ fontSize: 13 }} />
            <YAxis name={yAxis} tick={{ fontSize: 13 }} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#fa8000" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    if (chartType === "Area" && chartData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={chartData} margin={{ top: 24, right: 16, left: 16, bottom: 24 }}>
            <CartesianGrid />
            <XAxis dataKey="x" name={xAxis} tick={{ fontSize: 13 }} />
            <YAxis name={yAxis} tick={{ fontSize: 13 }} />
            <Tooltip />
            <Area type="monotone" dataKey="y" stroke="#fa8000" fill="#fae0aa" />
          </AreaChart>
        </ResponsiveContainer>
      );
    if (chartType === "Pie" && pieData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Tooltip />
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
              {pieData.map((entry, idx) => (
                <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    if (chartType === "Radar" && radarData.length > 0)
      chartEl = (
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name={radarValue} dataKey="value" stroke="#fa8000" fill="#fae0aa" fillOpacity={0.7} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      );

    return (
      <>
        <Box ref={mainChartRef}>{chartEl}</Box>
        <ExportChartButton chartRef={mainChartRef} filename={`${chartType}_chart.png`} />
      </>
    );
  }

  // ----------- DASHBOARD (Auto EDA) -----------
  function renderDashboard() {
    let chartIdx = 0;
    function attachRef() {
      const ref = React.createRef();
      dashboardChartRefs.current.push(ref);
      return ref;
    }
    return (
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ mt: 2, mb: 2, color: "#163356" }}>
          📊 Numeric Column Distributions
        </Typography>
        {!numericColumns.length && <Alert severity="info">No numeric columns found.</Alert>}
        <Stack spacing={3}>
          {numericColumns.map(col => (
            <Card key={col} sx={{ bgcolor: "#fffbe8", borderRadius: 2, boxShadow: "0 2px 12px #fae0aa22" }}>
              <CardHeader title={`Histogram of ${col}`} />
              <CardContent>
                <Box ref={attachRef()}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={toPieDataByCount(data, columns, col)}>
                      <CartesianGrid />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#fa8000" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <ExportChartButton chartRef={dashboardChartRefs.current[chartIdx++]} filename={`hist_${col}.png`} />
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ mt: 4, mb: 2, color: "#163356" }}>
          🧩 Categorical Column Distributions
        </Typography>
        {!categoricalColumns.length && <Alert severity="info">No categorical columns found.</Alert>}
        <Stack spacing={3}>
          {categoricalColumns.map(col => {
            const unique = [...new Set(data.map(row => row[columns.indexOf(col)]))];
            let chartType = "pie";
            if (unique.length > 10 && unique.length < 30) chartType = "bar";
            if (unique.length >= 30)
              return <Alert key={col} severity="info" sx={{ mt: 2 }}>{col} has too many unique categories for plotting.</Alert>
            return (
              <Card key={col} sx={{ bgcolor: "#fffbe8", borderRadius: 2, boxShadow: "0 2px 12px #fae0aa22" }}>
                <CardHeader title={`${chartType === "pie" ? "Pie" : "Bar"} Chart of ${col}`} />
                <CardContent>
                  <Box ref={attachRef()}>
                    {chartType === "pie" ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Tooltip />
                          <Pie data={toPieDataByCount(data, columns, col)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {toPieDataByCount(data, columns, col).map((entry, idx) => (
                              <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={toPieDataByCount(data, columns, col)}>
                          <CartesianGrid />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#fa8000" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                  <ExportChartButton chartRef={dashboardChartRefs.current[chartIdx++]} filename={`${col}_${chartType}.png`} />
                </CardContent>
              </Card>
            );
          })}
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ mt: 4, mb: 2, color: "#163356" }}>
          ⏳ Time Series Trends (Line Charts)
        </Typography>
        {(!dateColumns.length || !numericColumns.length) && <Alert severity="info">No time series columns found.</Alert>}
        <Stack spacing={3}>
          {dateColumns.map(dateCol =>
            numericColumns.map(numCol => (
              <Card key={`${dateCol}-${numCol}`} sx={{ bgcolor: "#fffbe8", borderRadius: 2, boxShadow: "0 2px 12px #fae0aa22" }}>
                <CardHeader title={`Line Chart: ${numCol} over ${dateCol}`} />
                <CardContent>
                  <Box ref={attachRef()}>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        data={
                          data
                            .map(row => ({
                              x: row[columns.indexOf(dateCol)],
                              y: Number(row[columns.indexOf(numCol)])
                            }))
                            .filter(item => !isNaN(item.y))
                            .sort((a, b) => new Date(a.x) - new Date(b.x))
                        }
                      >
                        <CartesianGrid />
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="y" stroke="#fa8000" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <ExportChartButton chartRef={dashboardChartRefs.current[chartIdx++]} filename={`trend_${numCol}_over_${dateCol}.png`} />
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    );
  }

  // Defensive: No data
  if (!columns.length || !data.length) {
    return (
      <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: "0 2px 16px #fae0aa22", borderRadius: 4, mb: 6 }}>
        <CardHeader
          avatar={<InsertChart sx={{ color: "#fa8000", fontSize: 36 }} />}
          title={<Typography variant="h5" fontWeight={800} color="#fa8000" letterSpacing={1}>
            Charts & Visualization
          </Typography>}
          sx={{ pb: 0, pt: 3, px: 3 }}
        />
        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ color: "gray" }}>
            Please upload the data file first to build charts.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <Card sx={{ maxWidth: 900, mx: "auto", boxShadow: "0 2px 16px #fae0aa22", borderRadius: 4, mb: 6, bgcolor: "#f7f8fa" }}>
      <CardHeader
        avatar={<InsertChart sx={{ color: "#fa8000", fontSize: 36 }} />}
        title={
          <Typography variant="h5" fontWeight={900} color="#163356" letterSpacing={1}>
            📈 Charts & Visualization
          </Typography>
        }
        sx={{ pb: 0, pt: 3, px: 3, bgcolor: "#f7f8fa" }}
        action={<DownloadDataButton data={data} columns={columns} />}
      />
      <CardContent sx={{ pb: 0, pt: 1 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          <ScatterPlot sx={{ mr: 1, color: "#fa8000" }} />
          Interactive Chart Builder
        </Typography>
        <Stack direction="row" spacing={3} sx={{ alignItems: "center", mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Chart Type</Typography>
            <Select
              value={chartType}
              onChange={e => { setShow(false); setChartType(e.target.value); }}
              size="small"
              sx={{ minWidth: 120, borderRadius: 2, fontWeight: 600 }}
            >
              {[
                { value: "Scatter", label: "Scatter", icon: <ScatterPlot /> },
                { value: "Bar", label: "Bar", icon: <BarChartIcon /> },
                { value: "Line", label: "Line", icon: <Timeline /> },
                { value: "Area", label: "Area", icon: <BubbleChart /> },
                { value: "Pie", label: "Pie", icon: <PieChartIcon /> },
                { value: "Radar", label: "Radar", icon: <InsertChart /> }
              ].map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {type.icon} {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
          {renderControls()}
        </Stack>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#fa8000",
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: "0 2px 8px #fa800040",
            "&:hover": { bgcolor: "#d76e00" }
          }}
          onClick={() => setShow(true)}
          disabled={
            (chartType === "Pie" && (!pieCategory || !pieValue)) ||
            (chartType === "Radar" && (!radarCategory || !radarValue)) ||
            (!xAxis || !yAxis)
          }
        >
          Show Chart
        </Button>
        {show && (
          <Card
            sx={{
              mt: 4,
              py: 4,
              bgcolor: "#fffbe8",
              borderRadius: 3,
              textAlign: "center",
              boxShadow: "0 2px 16px #fae0aa22"
            }}
          >
            {renderChart()}
            <Typography sx={{ mt: 2, fontSize: 16, color: "#333" }}>
              Showing <b>{chartType}</b> chart.
            </Typography>
          </Card>
        )}
        <Divider sx={{ my: 4 }} />
        {/* Auto-EDA Dashboard */}
        <Accordion expanded={dashboardOpen} onChange={() => setDashboardOpen(!dashboardOpen)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700} color="#163356" fontSize="1.1em">
              🧮 Show Full Data Dashboard (All Charts Summary)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<PictureAsPdf />}
                onClick={() => exportChartsToPDF(dashboardChartRefs.current, "charts_dashboard.pdf")}
              >
                Export All to PDF
              </Button>
              <Button
                variant="contained"
                size="small"
                color="info"
                startIcon={<Slideshow />}
                onClick={() => exportChartsToPPT(dashboardChartRefs.current, "charts_dashboard.pptx")}
              >
                Export All to PPTX
              </Button>
            </Stack>
            {renderDashboard()}
            <Typography sx={{ mt: 4, color: "#5c6b87", fontSize: 13 }}>
              <i>
                Tip: The interactive chart above is ideal for presentations, analysis and insight.
                <br />
                The full dashboard is perfect for “one-click EDA”, internal reviews, or exporting all visuals at once.<br />
                <b>All chart images can be saved for automated reporting in future versions.</b>
              </i>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
