import React, { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import {
  Box, Card, CardHeader, CardContent, Divider, Button, Typography, CircularProgress, Alert,
  Chip, LinearProgress, Grid, Paper, Tooltip
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pptxgen from "pptxgenjs";
import { saveAs } from "file-saver";
import Plotly from "plotly.js-dist-min";
import Plot from "react-plotly.js";
import { askOpenAI } from "../utils/openai";

// Arcadis branding and configuration
const ARCADIS_ORANGE = "#fa8000";
const ARCADIS_DARK = "#1c4587";
const MODEL_NAME = "gpt-4o (Arcadis Azure OpenAI)";

// Enhanced chart configuration generator
const getEnhancedChartConfig = (columns, data, chartType = "bar") => {
  if (!columns.length || !data.length) return null;
  
  // Smart column detection
  const numericCols = columns.filter((col, idx) => 
    data.slice(0, 10).every(row => !isNaN(parseFloat(row[idx])) && isFinite(row[idx]))
  );
  const categoricalCols = columns.filter(col => 
    !numericCols.includes(col) && !col.toLowerCase().includes("id")
  );
  
  if (numericCols.length === 0 || categoricalCols.length === 0) {
    // Fallback to simple configuration
    const xIdx = 0;
    const yIdx = columns.findIndex((col, idx) => 
      data.slice(0, 5).some(row => !isNaN(parseFloat(row[idx])))
    );
    if (yIdx < 0) return null;
    
    return {
      data: [{
        x: data.slice(0, 15).map(row => row[xIdx]),
        y: data.slice(0, 15).map(row => parseFloat(row[yIdx]) || 0),
        type: chartType,
        marker: { color: ARCADIS_ORANGE },
        name: columns[yIdx]
      }],
      layout: {
        width: 800,
        height: 400,
        margin: { t: 60, l: 60, r: 40, b: 80 },
        title: {
          text: `${columns[yIdx]} Analysis`,
          font: { size: 18, color: ARCADIS_DARK }
        },
        xaxis: { title: columns[xIdx], titlefont: { color: ARCADIS_DARK } },
        yaxis: { title: columns[yIdx], titlefont: { color: ARCADIS_DARK } },
        plot_bgcolor: "#ffffff",
        paper_bgcolor: "#ffffff"
      },
      config: { displayModeBar: false }
    };
  }

  // Enhanced chart with proper data types
  const xCol = categoricalCols[0];
  const yCol = numericCols[0];
  const xIdx = columns.indexOf(xCol);
  const yIdx = columns.indexOf(yCol);

  return {
    data: [{
      x: data.slice(0, 15).map(row => row[xIdx]),
      y: data.slice(0, 15).map(row => parseFloat(row[yIdx]) || 0),
      type: chartType,
      marker: { 
        color: ARCADIS_ORANGE,
        line: { color: ARCADIS_DARK, width: 1 }
      },
      name: yCol
    }],
    layout: {
      width: 800,
      height: 400,
      margin: { t: 60, l: 60, r: 40, b: 80 },
      title: {
        text: `${yCol} by ${xCol}`,
        font: { size: 18, color: ARCADIS_DARK, family: "Inter, sans-serif" }
      },
      xaxis: { 
        title: xCol, 
        titlefont: { color: ARCADIS_DARK, size: 14 },
        tickfont: { color: ARCADIS_DARK }
      },
      yaxis: { 
        title: yCol, 
        titlefont: { color: ARCADIS_DARK, size: 14 },
        tickfont: { color: ARCADIS_DARK }
      },
      plot_bgcolor: "#ffffff",
      paper_bgcolor: "#ffffff",
      font: { family: "Inter, sans-serif" }
    },
    config: { displayModeBar: false }
  };
};

export default function ExportPanel() {
  const { columns, data, qnaHistory = [] } = useData();
  const [chartRec, setChartRec] = useState("");
  const [businessInsights, setBusinessInsights] = useState("");
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [dataQuality, setDataQuality] = useState("");
  const [chartLoading, setChartLoading] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [chartImage, setChartImage] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const chartRef = useRef();

  // Clear alerts after 5s
  React.useEffect(() => {
    if (aiError || successMsg) {
      const timer = setTimeout(() => {
        setAiError("");
        setSuccessMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aiError, successMsg]);

  // Enhanced data analysis function
  const getDataSummary = () => {
    if (!columns.length || !data.length) return {};
    
    const numRows = data.length;
    const numCols = columns.length;
    const numericCols = columns.filter((col, idx) => 
      data.slice(0, 10).every(row => !isNaN(parseFloat(row[idx])) && isFinite(row[idx]))
    );
    const categoricalCols = columns.filter(col => !numericCols.includes(col));
    
    return {
      rows: numRows,
      columns: numCols,
      numericColumns: numericCols.length,
      categoricalColumns: categoricalCols.length,
      sampleData: data.slice(0, 3)
    };
  };

  // AI Chart Recommendation with enhanced prompting
  const handleAIChartRec = async () => {
    setChartLoading(true);
    setAiError(""); 
    setSuccessMsg(""); 
    setChartRec("");
    
    if (!columns.length || !data.length) {
      setAiError("No data uploaded."); 
      setChartLoading(false); 
      return;
    }

    const dataSummary = getDataSummary();
    const sample = [columns, ...data.slice(0, 15)];
    
    const prompt = [
      { 
        role: "system", 
        content: `You are a senior data visualization expert at Arcadis. Based on the dataset provided, recommend the most effective chart type and explain your reasoning. Consider the data types, business context, and visualization best practices. Provide specific column recommendations and explain why this visualization will be most valuable for decision-making.` 
      },
      { 
        role: "user", 
        content: `Dataset Analysis:
- Rows: ${dataSummary.rows}
- Columns: ${dataSummary.columns} (${dataSummary.numericColumns} numeric, ${dataSummary.categoricalColumns} categorical)
- Sample data: ${JSON.stringify(sample)}

Please recommend:
1. Best chart type and why
2. Which columns to use (X and Y axis)
3. Business insights this visualization will reveal
4. Any data transformations needed

Keep the response clear and actionable for business stakeholders.` 
      }
    ];

    try {
      const result = await askOpenAI(prompt, { model: "gpt-4o", max_tokens: 800 });
      setChartRec(result);
      setSuccessMsg("AI Chart Recommendation generated successfully!");
    } catch (error) {
      setAiError("Failed to generate chart recommendation. Please check your connection and try again.");
      console.error("Chart recommendation error:", error);
    }
    setChartLoading(false);
  };

  // Enhanced Business Insights with industry focus
  const handleBusinessInsights = async () => {
    setInsightLoading(true);
    setAiError(""); 
    setSuccessMsg(""); 
    setBusinessInsights("");
    
    if (!columns.length || !data.length) {
      setAiError("No data uploaded."); 
      setInsightLoading(false); 
      return;
    }

    const dataSummary = getDataSummary();
    const sample = [columns, ...data.slice(0, 20)];
    
    const prompt = [
      { 
        role: "system", 
        content: `You are a senior business analyst at Arcadis with expertise in data-driven decision making. Analyze the provided dataset and generate actionable business insights. Focus on practical recommendations that can drive business value and operational improvements.` 
      },
      { 
        role: "user", 
        content: `Dataset Overview:
- ${dataSummary.rows} records across ${dataSummary.columns} variables
- ${dataSummary.numericColumns} quantitative and ${dataSummary.categoricalColumns} categorical fields
- Sample: ${JSON.stringify(sample)}

Please provide:
1. **Key Findings**: 3 most important patterns or trends
2. **Business Opportunities**: Specific recommendations for improvement
3. **Risk Areas**: Potential concerns or areas needing attention
4. **Next Steps**: Actionable recommendations for stakeholders

Format as clear, executive-ready insights with specific data points where relevant.` 
      }
    ];

    try {
      const result = await askOpenAI(prompt, { model: "gpt-4o", max_tokens: 1200 });
      setBusinessInsights(result);
      setSuccessMsg("Business insights generated successfully!");
    } catch (error) {
      setAiError("Failed to generate business insights. Please try again.");
      console.error("Business insights error:", error);
    }
    setInsightLoading(false);
  };

  // Executive Summary for PowerPoint
  const handleExecutiveSummary = async () => {
    setSummaryLoading(true);
    setAiError(""); 
    setSuccessMsg(""); 
    setExecutiveSummary("");
    
    if (!columns.length || !data.length) {
      setAiError("No data uploaded."); 
      setSummaryLoading(false); 
      return;
    }

    const dataSummary = getDataSummary();
    
    const prompt = [
      { 
        role: "system", 
        content: `You are an executive consultant preparing a high-level summary for C-suite stakeholders. Create a concise, impactful executive summary that highlights the most critical insights and recommendations from this dataset analysis.` 
      },
      { 
        role: "user", 
        content: `Dataset: ${dataSummary.rows} records, ${dataSummary.columns} variables
Columns: ${columns.join(", ")}

Create a brief executive summary (2-3 paragraphs) that includes:
- What this data represents
- Most critical findings
- Strategic implications
- Recommended actions

Write for busy executives who need quick, actionable insights.` 
      }
    ];

    try {
      const result = await askOpenAI(prompt, { model: "gpt-4o", max_tokens: 600 });
      setExecutiveSummary(result);
      setSuccessMsg("Executive summary generated!");
    } catch (error) {
      setAiError("Failed to generate executive summary.");
      console.error("Executive summary error:", error);
    }
    setSummaryLoading(false);
  };

  // Data Quality Assessment
  const handleDataQuality = async () => {
    setQualityLoading(true);
    setAiError(""); 
    setSuccessMsg(""); 
    setDataQuality("");
    
    if (!columns.length || !data.length) {
      setAiError("No data uploaded."); 
      setQualityLoading(false); 
      return;
    }

    // Analyze data quality metrics
    const qualityMetrics = {
      totalRows: data.length,
      totalColumns: columns.length,
      emptyValues: 0,
      duplicateRows: 0,
      dataTypes: {}
    };

    // Count empty values
    data.forEach(row => {
      row.forEach(cell => {
        if (!cell || cell.toString().trim() === "") {
          qualityMetrics.emptyValues++;
        }
      });
    });

    // Check data types per column
    columns.forEach((col, idx) => {
      const sample = data.slice(0, 10).map(row => row[idx]);
      const isNumeric = sample.every(val => !isNaN(parseFloat(val)) && isFinite(val));
      qualityMetrics.dataTypes[col] = isNumeric ? "numeric" : "text";
    });

    const prompt = [
      { 
        role: "system", 
        content: `You are a data quality specialist. Analyze the dataset metrics and provide a comprehensive data quality assessment with recommendations for improvement.` 
      },
      { 
        role: "user", 
        content: `Data Quality Metrics:
- Total Records: ${qualityMetrics.totalRows}
- Total Fields: ${qualityMetrics.totalColumns}
- Empty Values: ${qualityMetrics.emptyValues}
- Data Types: ${JSON.stringify(qualityMetrics.dataTypes)}
- Sample Data: ${JSON.stringify([columns, ...data.slice(0, 5)])}

Provide assessment on:
1. Overall data quality score (1-10)
2. Key quality issues identified
3. Impact on analysis reliability
4. Recommendations for data improvement
5. Confidence level in current analysis

Be specific and actionable.` 
      }
    ];

    try {
      const result = await askOpenAI(prompt, { model: "gpt-4o", max_tokens: 800 });
      setDataQuality(result);
      setSuccessMsg("Data quality assessment completed!");
    } catch (error) {
      setAiError("Failed to assess data quality.");
      console.error("Data quality error:", error);
    }
    setQualityLoading(false);
  };
  // Enhanced Chart Image Generation
  const generateChartImage = async () => {
    if (!columns.length || !data.length) return null;
    
    const chartConfig = getEnhancedChartConfig(columns, data.slice(0, 20));
    if (!chartConfig) return null;
    
    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.height = "400px";
      document.body.appendChild(tempDiv);
      
      await Plotly.newPlot(tempDiv, chartConfig.data, chartConfig.layout, chartConfig.config);
      const img = await Plotly.toImage(tempDiv, { 
        format: "png", 
        width: 800, 
        height: 400,
        scale: 2 // Higher quality
      });
      
      setChartImage(img);
      document.body.removeChild(tempDiv);
      return img;
    } catch (error) {
      console.error("Chart generation error:", error);
      return null;
    }
  };

  // Enhanced PowerPoint Export with Professional Design
  const handleDownloadPPT = async () => {
    try {
      setExportProgress(10);
      const pptx = new pptxgen();
      
      // Set presentation properties
      pptx.author = "Arcadis AI Platform";
      pptx.company = "Arcadis";
      pptx.revision = "1";
      pptx.title = "Data Analysis Report";
      pptx.subject = "AI-Powered Data Insights";

      setExportProgress(20);

      // Custom slide layouts with Arcadis branding
      const titleSlideOptions = {
        backgroundColor: "#ffffff",
        margin: 0.5
      };

      // 1. Professional Title Slide
      const titleSlide = pptx.addSlide(titleSlideOptions);
      
      // Arcadis header with orange accent
      titleSlide.addShape("rect", {
        x: 0, y: 0, w: "100%", h: 0.8,
        fill: { color: ARCADIS_ORANGE }
      });
      
      titleSlide.addText("ARCADIS AI PLATFORM", {
        x: 0.5, y: 0.2, w: 9, h: 0.4,
        fontSize: 16, fontFace: "Calibri", color: "ffffff",
        bold: true, align: "left"
      });

      titleSlide.addText("Data Analysis Report", {
        x: 0.5, y: 1.2, w: 9, h: 0.8,
        fontSize: 36, fontFace: "Calibri", color: ARCADIS_DARK,
        bold: true, align: "left"
      });

      titleSlide.addText("AI-Powered Insights & Recommendations", {
        x: 0.5, y: 2.0, w: 9, h: 0.5,
        fontSize: 18, fontFace: "Calibri", color: "#666666",
        align: "left"
      });

      const dataSummary = getDataSummary();
      titleSlide.addText(`Dataset: ${dataSummary.rows} records | ${dataSummary.columns} variables\nGenerated: ${new Date().toLocaleString()}`, {
        x: 0.5, y: 6.5, w: 9, h: 0.8,
        fontSize: 12, fontFace: "Calibri", color: "#888888",
        align: "left"
      });

      setExportProgress(30);

      // 2. Executive Summary Slide
      if (executiveSummary) {
        const execSlide = pptx.addSlide();
        execSlide.addText("Executive Summary", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });
        
        execSlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });
        
        execSlide.addText(executiveSummary, {
          x: 0.5, y: 1.5, w: 9, h: 4.5,
          fontSize: 14, fontFace: "Calibri", color: "#333333",
          align: "left", valign: "top"
        });
      }

      setExportProgress(40);

      // 3. Data Overview Slide
      const dataSlide = pptx.addSlide();
      dataSlide.addText("Dataset Overview", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
        bold: true
      });

      dataSlide.addShape("line", {
        x: 0.5, y: 1.2, w: 9, h: 0,
        line: { color: ARCADIS_ORANGE, width: 3 }
      });

      // Data summary table
      const summaryTableData = [
        [
          { text: "Metric", options: { bold: true, color: "ffffff", fill: { color: ARCADIS_DARK } } },
          { text: "Value", options: { bold: true, color: "ffffff", fill: { color: ARCADIS_DARK } } }
        ],
        ["Total Records", dataSummary.rows.toLocaleString()],
        ["Total Variables", dataSummary.columns.toString()],
        ["Numeric Variables", dataSummary.numericColumns.toString()],
        ["Categorical Variables", dataSummary.categoricalColumns.toString()],
        ["Data Quality", "Assessed by AI"]
      ];

      dataSlide.addTable(summaryTableData, {
        x: 0.5, y: 1.8, w: 4, h: 3,
        fontSize: 12, fontFace: "Calibri",
        border: { pt: 1, color: "#cccccc" },
        fill: { color: "#f8f9fa" }
      });

      // Sample data preview
      if (data.length > 0) {
        const sampleData = [
          columns.map(col => ({ 
            text: col, 
            options: { bold: true, color: "ffffff", fill: { color: ARCADIS_ORANGE } } 
          })),
          ...data.slice(0, 3).map(row => row.map(cell => cell?.toString() || ""))
        ];

        dataSlide.addTable(sampleData, {
          x: 5, y: 1.8, w: 4.5, h: 3,
          fontSize: 10, fontFace: "Calibri",
          border: { pt: 1, color: "#cccccc" }
        });
      }

      setExportProgress(50);

      // 4. AI Chart Recommendation Slide
      if (chartRec) {
        const chartRecSlide = pptx.addSlide();
        chartRecSlide.addText("AI Chart Recommendations", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });

        chartRecSlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });

        chartRecSlide.addText(chartRec, {
          x: 0.5, y: 1.5, w: 9, h: 4,
          fontSize: 13, fontFace: "Calibri", color: "#333333",
          align: "left", valign: "top"
        });

        chartRecSlide.addText(`Generated by: ${MODEL_NAME}`, {
          x: 0.5, y: 6, w: 9, h: 0.3,
          fontSize: 10, fontFace: "Calibri", color: "#888888",
          italic: true
        });
      }

      setExportProgress(60);

      // 5. Chart Visualization Slide
      const img = chartImage || (await generateChartImage());
      if (img) {
        const chartSlide = pptx.addSlide();
        chartSlide.addText("Data Visualization", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });

        chartSlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });

        chartSlide.addImage({ 
          data: img, 
          x: 1, y: 1.8, w: 8, h: 4.5,
          sizing: { type: "contain", w: 8, h: 4.5 }
        });
      }

      setExportProgress(70);

      // 6. Business Insights Slide
      if (businessInsights) {
        const insightsSlide = pptx.addSlide();
        insightsSlide.addText("Business Insights & Opportunities", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });

        insightsSlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });

        insightsSlide.addText(businessInsights, {
          x: 0.5, y: 1.5, w: 9, h: 4.5,
          fontSize: 13, fontFace: "Calibri", color: "#333333",
          align: "left", valign: "top"
        });
      }

      setExportProgress(80);

      // 7. Data Quality Assessment Slide
      if (dataQuality) {
        const qualitySlide = pptx.addSlide();
        qualitySlide.addText("Data Quality Assessment", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });

        qualitySlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });

        qualitySlide.addText(dataQuality, {
          x: 0.5, y: 1.5, w: 9, h: 4.5,
          fontSize: 13, fontFace: "Calibri", color: "#333333",
          align: "left", valign: "top"
        });
      }

      setExportProgress(90);

      // 8. Q&A History Slide (if available)
      if (qnaHistory && qnaHistory.length > 0) {
        const qnaSlide = pptx.addSlide();
        qnaSlide.addText("Q&A Analysis History", {
          x: 0.5, y: 0.5, w: 9, h: 0.6,
          fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
          bold: true
        });

        qnaSlide.addShape("line", {
          x: 0.5, y: 1.2, w: 9, h: 0,
          line: { color: ARCADIS_ORANGE, width: 3 }
        });

        const qnaTableData = [
          [
            { text: "Question", options: { bold: true, color: "ffffff", fill: { color: ARCADIS_DARK } } },
            { text: "AI Response", options: { bold: true, color: "ffffff", fill: { color: ARCADIS_DARK } } }
          ],
          ...qnaHistory.slice(0, 8).map(item => [
            item.q.length > 80 ? item.q.substring(0, 80) + "..." : item.q,
            item.a.length > 120 ? item.a.substring(0, 120) + "..." : item.a
          ])
        ];

        qnaSlide.addTable(qnaTableData, {
          x: 0.5, y: 1.8, w: 9, h: 4.5,
          fontSize: 11, fontFace: "Calibri",
          border: { pt: 1, color: "#cccccc" },
          colW: [3, 6]
        });
      }

      // 9. Next Steps & Recommendations Slide
      const nextStepsSlide = pptx.addSlide();
      nextStepsSlide.addText("Next Steps & Recommendations", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 28, fontFace: "Calibri", color: ARCADIS_DARK,
        bold: true
      });

      nextStepsSlide.addShape("line", {
        x: 0.5, y: 1.2, w: 9, h: 0,
        line: { color: ARCADIS_ORANGE, width: 3 }
      });

      const recommendations = [
        "• Validate key findings with domain experts",
        "• Implement recommended visualizations in reporting dashboards", 
        "• Address data quality issues identified in the assessment",
        "• Explore advanced analytics opportunities highlighted by AI",
        "• Schedule regular data reviews to track improvements",
        "• Consider additional data sources to enhance analysis depth"
      ];

      nextStepsSlide.addText(recommendations.join("\n\n"), {
        x: 0.5, y: 1.8, w: 9, h: 4,
        fontSize: 14, fontFace: "Calibri", color: "#333333",
        align: "left", valign: "top"
      });

      setExportProgress(95);

      // Generate and save the presentation
      await pptx.writeFile({ fileName: `Arcadis_AI_Analysis_Report_${new Date().getTime()}.pptx` });
      
      setExportProgress(100);
      setSuccessMsg("Professional PowerPoint report generated successfully!");
      
      // Reset progress after a delay
      setTimeout(() => setExportProgress(0), 2000);
      
    } catch (error) {
      setAiError("PowerPoint export failed: " + error.message);
      setExportProgress(0);
      console.error("PPT export error:", error);
    }
  };

  // Excel Export (enhanced)
  const handleDownloadExcel = () => {
    try {
      const ws = XLSX.utils.aoa_to_sheet([columns, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      
      // Add summary sheet if we have insights
      if (businessInsights || chartRec) {
        const summaryData = [
          ["Arcadis AI Platform - Analysis Summary"],
          [""],
          ["Generated:", new Date().toLocaleString()],
          ["Dataset Size:", `${data.length} rows × ${columns.length} columns`],
          [""],
          ["AI Chart Recommendation:"],
          [chartRec || "Not generated"],
          [""],
          ["Business Insights:"],
          [businessInsights || "Not generated"]
        ];
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, "AI Summary");
      }
      
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 
        `Arcadis_Data_Export_${new Date().getTime()}.xlsx`);
      setSuccessMsg("Enhanced Excel file downloaded!");
    } catch (error) {
      setAiError("Excel export failed: " + error.message);
    }
  };

  // Enhanced PDF Export
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      
      // Header with Arcadis branding
      doc.setFillColor(250, 128, 0); // Arcadis orange
      doc.rect(0, 0, 297, 20, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ARCADIS AI PLATFORM", 10, 12);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text("Data Analysis Report", 10, 35);
      
      let yPos = 50;
      
      // Data table
      if (columns.length && data.length) {
        doc.autoTable({
          head: [columns],
          body: data.slice(0, 25),
          startY: yPos,
          margin: { left: 10, right: 10 },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [250, 128, 0], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [248, 249, 250] }
        });
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // AI insights
      if (chartRec && yPos < 180) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("AI Chart Recommendation:", 10, yPos);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const recLines = doc.splitTextToSize(chartRec, 270);
        doc.text(recLines, 10, yPos + 8);
        yPos += Math.min(recLines.length * 4 + 15, 40);
      }
      
      if (businessInsights && yPos < 160) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Business Insights:", 10, yPos);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const insightLines = doc.splitTextToSize(businessInsights, 270);
        doc.text(insightLines, 10, yPos + 8);
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated by Arcadis AI Platform | ${new Date().toLocaleString()}`, 10, 200);
      
      doc.save(`Arcadis_Analysis_Report_${new Date().getTime()}.pdf`);
      setSuccessMsg("Enhanced PDF report generated!");
    } catch (error) {
      setAiError("PDF export failed: " + error.message);
    }
  };

  // Get current chart configuration
  const chartConfig = getEnhancedChartConfig(columns, data.slice(0, 20));

  return (
    <Card sx={{ 
      maxWidth: 1000, 
      mx: "auto", 
      boxShadow: "0 4px 20px rgba(250, 128, 0, 0.1)", 
      borderRadius: 3, 
      mb: 6,
      border: `1px solid ${ARCADIS_ORANGE}20`
    }}>
      <CardHeader
        avatar={<AssessmentIcon sx={{ color: ARCADIS_ORANGE, fontSize: 36 }} />}
        title={
          <Typography variant="h4" fontWeight={700} color={ARCADIS_DARK} letterSpacing={0.5}>
            Export & AI Analysis
          </Typography>
        }
        subheader={
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Generate professional reports with AI-powered insights and recommendations
          </Typography>
        }
        sx={{ pb: 1, pt: 3, px: 3 }}
      />
      
      <CardContent sx={{ pb: 3, pt: 1, px: 3 }}>
        <Divider sx={{ mb: 3 }} />

        {/* Alert Messages */}
        {aiError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {aiError}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {successMsg}
          </Alert>
        )}

        {/* Progress Bar for Export */}
        {exportProgress > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Generating PowerPoint... {exportProgress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={exportProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: ARCADIS_ORANGE
                }
              }} 
            />
          </Box>
        )}

        {/* AI Analysis Panel */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: "#fafbfc", 
            border: `1px solid ${ARCADIS_ORANGE}30`,
            borderRadius: 3 
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SmartToyIcon sx={{ color: ARCADIS_ORANGE, mr: 2, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} color={ARCADIS_DARK}>
              AI-Powered Analysis
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Get AI recommendations for the best chart type and visualization approach">
                <Button
                  onClick={handleAIChartRec}
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: ARCADIS_ORANGE, 
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { bgcolor: "#e87300" }
                  }}
                  startIcon={<BarChartIcon />}
                  disabled={chartLoading || !columns.length}
                >
                  {chartLoading ? <CircularProgress size={20} color="inherit" /> : "Chart Rec"}
                </Button>
              </Tooltip>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Generate actionable business insights and recommendations">
                <Button
                  onClick={handleBusinessInsights}
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    color: ARCADIS_ORANGE, 
                    borderColor: ARCADIS_ORANGE, 
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { 
                      borderColor: "#e87300",
                      bgcolor: `${ARCADIS_ORANGE}10`
                    }
                  }}
                  startIcon={<InsightsIcon />}
                  disabled={insightLoading || !columns.length}
                >
                  {insightLoading ? <CircularProgress size={20} color="inherit" /> : "Insights"}
                </Button>
              </Tooltip>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Create executive-level summary for stakeholders">
                <Button
                  onClick={handleExecutiveSummary}
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    color: ARCADIS_DARK, 
                    borderColor: ARCADIS_DARK, 
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { 
                      borderColor: "#0f2d5c",
                      bgcolor: `${ARCADIS_DARK}10`
                    }
                  }}
                  startIcon={<TrendingUpIcon />}
                  disabled={summaryLoading || !columns.length}
                >
                  {summaryLoading ? <CircularProgress size={20} color="inherit" /> : "Summary"}
                </Button>
              </Tooltip>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Assess data quality and reliability">
                <Button
                  onClick={handleDataQuality}
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    color: "#666666", 
                    borderColor: "#666666", 
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { 
                      borderColor: "#444444",
                      bgcolor: "#66666610"
                    }
                  }}
                  disabled={qualityLoading || !columns.length}
                >
                  {qualityLoading ? <CircularProgress size={20} color="inherit" /> : "Quality"}
                </Button>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Display Analysis Results */}
          {executiveSummary && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa", borderLeft: `4px solid ${ARCADIS_ORANGE}` }}>
              <Typography variant="h6" fontWeight={600} color={ARCADIS_DARK} sx={{ mb: 1 }}>
                Executive Summary
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {executiveSummary}
              </Typography>
            </Paper>
          )}

          {chartRec && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: "#fff9f0", borderLeft: `4px solid ${ARCADIS_ORANGE}` }}>
              <Typography variant="h6" fontWeight={600} color={ARCADIS_ORANGE} sx={{ mb: 1 }}>
                <BarChartIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle" }} />
                AI Chart Recommendation
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6, mb: 1 }}>
                {chartRec}
              </Typography>
              <Chip 
                label={MODEL_NAME} 
                size="small" 
                sx={{ 
                  bgcolor: `${ARCADIS_ORANGE}20`, 
                  color: ARCADIS_ORANGE,
                  fontSize: "0.75rem"
                }} 
              />
            </Paper>
          )}

          {businessInsights && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: "#f0f8f4", borderLeft: "4px solid #4caf50" }}>
              <Typography variant="h6" fontWeight={600} color="#2e7d32" sx={{ mb: 1 }}>
                <InsightsIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle" }} />
                Business Insights & Opportunities
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {businessInsights}
              </Typography>
            </Paper>
          )}

          {dataQuality && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: "#f3f4f6", borderLeft: "4px solid #6b7280" }}>
              <Typography variant="h6" fontWeight={600} color="#374151" sx={{ mb: 1 }}>
                Data Quality Assessment
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {dataQuality}
              </Typography>
            </Paper>
          )}
        </Paper>

        {/* Live Chart Preview */}
        {chartConfig && (
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 4, 
              p: 2, 
              bgcolor: "#ffffff", 
              borderRadius: 3,
              border: `1px solid ${ARCADIS_ORANGE}20`
            }}
          >
            <Typography variant="h6" fontWeight={600} color={ARCADIS_DARK} sx={{ mb: 2 }}>
              <BarChartIcon sx={{ mr: 1, color: ARCADIS_ORANGE }} />
              Chart Preview
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Plot 
                ref={chartRef} 
                data={chartConfig.data} 
                layout={chartConfig.layout} 
                config={chartConfig.config} 
                style={{ width: "100%", maxWidth: 800 }} 
              />
            </Box>
          </Paper>
        )}

        {/* Export Options */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: "#fafbfc", 
            border: `1px solid ${ARCADIS_ORANGE}30`,
            borderRadius: 3 
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: ARCADIS_DARK }}>
            Export Professional Reports
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate comprehensive reports with AI analysis, visualizations, and actionable insights.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ 
                  color: ARCADIS_ORANGE, 
                  borderColor: ARCADIS_ORANGE, 
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": { 
                    borderColor: "#e87300",
                    bgcolor: `${ARCADIS_ORANGE}10`
                  }
                }}
                startIcon={<DownloadIcon />}
                onClick={handleDownloadExcel}
                disabled={!columns.length || !data.length}
              >
                Excel Report
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ 
                  color: ARCADIS_DARK, 
                  borderColor: ARCADIS_DARK, 
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": { 
                    borderColor: "#0f2d5c",
                    bgcolor: `${ARCADIS_DARK}10`
                  }
                }}
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDF}
                disabled={!columns.length || !data.length}
              >
                PDF Report
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  bgcolor: ARCADIS_ORANGE, 
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": { bgcolor: "#e87300" }
                }}
                startIcon={<SlideshowIcon />}
                onClick={handleDownloadPPT}
                disabled={!columns.length || !data.length || exportProgress > 0}
              >
                PowerPoint Report
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </CardContent>
    </Card>
  );
}
