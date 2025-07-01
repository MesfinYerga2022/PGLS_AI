import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha
} from "@mui/material";
import {
  CloudUpload,
  DeleteOutline,
  CheckCircle,
  InsertDriveFile,
  Assessment,
  Refresh
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useData } from "../context/DataContext";

const steps = ['Select File', 'Process Data', 'Preview & Validate'];

export default function FileUpload() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileStats, setFileStats] = useState(null);

  // Defensive: default to empty arrays if undefined
  const {
    file, setFile,
    columns = [], setColumns,
    data = [], setData,
    clearData
  } = useData();

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    setLoading(true);
    setActiveStep(1);
    
    try {
      setFile(f);
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        if (json.length) {
          const cols = json[0];
          const rows = json.slice(1, 101); // first 100 rows
          
          setColumns(cols);
          setData(rows);
          
          // Calculate file statistics
          setFileStats({
            totalRows: json.length - 1,
            totalColumns: cols.length,
            fileSize: (f.size / 1024).toFixed(1),
            fileType: f.name.split('.').pop().toUpperCase(),
            previewRows: rows.length
          });
          
          setActiveStep(2);
        }
        setLoading(false);
      };
      
      reader.readAsBinaryString(f);
    } catch (error) {
      console.error('Error processing file:', error);
      setLoading(false);
      setActiveStep(0);
    }
  };

  const handleClear = () => {
    clearData();
    setFile(null);
    setFileStats(null);
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Progress Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ py: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    style: {
                      color: index <= activeStep ? theme.palette.secondary.main : theme.palette.grey[300]
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card
        sx={{
          mb: 4,
          border: `2px dashed ${!file ? theme.palette.secondary.main : theme.palette.success.main}`,
          backgroundColor: !file 
            ? alpha(theme.palette.secondary.main, 0.05)
            : alpha(theme.palette.success.main, 0.05),
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: !file ? theme.palette.secondary.dark : theme.palette.success.dark,
            backgroundColor: !file 
              ? alpha(theme.palette.secondary.main, 0.1)
              : alpha(theme.palette.success.main, 0.1),
          }
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          {!file ? (
            <>
              <CloudUpload 
                sx={{ 
                  fontSize: 64, 
                  color: theme.palette.secondary.main, 
                  mb: 2 
                }} 
              />
              <Typography variant="h5" fontWeight={600} color="secondary.main" gutterBottom>
                Upload Your Dataset
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Drag and drop your file here, or click to browse. Supports Excel (.xlsx) and CSV (.csv) files.
              </Typography>
              <Button
                variant="contained"
                component="label"
                size="large"
                startIcon={<CloudUpload />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Select File
                <input
                  type="file"
                  hidden
                  onChange={handleFile}
                  accept=".csv, .xlsx"
                />
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                Maximum file size: 10MB
              </Typography>
            </>
          ) : (
            <Stack alignItems="center" spacing={2}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
              <Typography variant="h6" fontWeight={600} color="success.main">
                File Uploaded Successfully
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  icon={<InsertDriveFile />}
                  label={file.name}
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
                <IconButton
                  onClick={handleClear}
                  color="error"
                  size="small"
                  title="Remove file"
                >
                  <DeleteOutline />
                </IconButton>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* File Statistics */}
      {fileStats && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Assessment color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Dataset Overview
              </Typography>
            </Stack>
            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {fileStats.totalRows.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Rows
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700} color="secondary.main">
                  {fileStats.totalColumns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Columns
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {fileStats.fileSize} KB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File Size
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {fileStats.fileType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File Type
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {columns.length > 0 && data.length > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Data Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing first {Math.min(10, data.length)} rows of {fileStats?.totalRows.toLocaleString() || data.length} total rows
                </Typography>
              </Box>
              <Button
                startIcon={<Refresh />}
                onClick={handleClear}
                variant="outlined"
                color="error"
                size="small"
              >
                Clear Data
              </Button>
            </Stack>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}>
                    {columns.map((col, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.secondary.main,
                          borderBottom: `2px solid ${theme.palette.secondary.main}`,
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(data) && data.slice(0, 10).map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                        },
                      }}
                    >
                      {columns.map((col, j) => (
                        <TableCell key={j} sx={{ py: 1.5 }}>
                          {row[j]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {data.length > 10 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Only showing first 10 rows in preview. Full dataset with {fileStats?.totalRows.toLocaleString() || data.length} rows is loaded for analysis.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
