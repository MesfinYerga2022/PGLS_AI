import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Divider
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReplayIcon from "@mui/icons-material/Replay";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { askOpenAI } from "../utils/openai";

export default function AIChartRecommendationPanel() {
  const { columns, data } = useData();
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [copied, setCopied] = useState(false);

  // Professional, clear prompt
  const prompt = [
    {
      role: "system",
      content:
        "You are a senior data visualization consultant. Recommend the single most effective chart for the provided tabular data. State: chart type, axes, columns, and why. Use clear, business-friendly language, max 2-3 sentences.",
    },
    {
      role: "user",
      content: `Here is the data (header row, up to 10 rows): ${JSON.stringify([
        columns,
        ...data.slice(0, 10),
      ])}`,
    },
  ];

  const handleRecommend = async () => {
    setLoading(true);
    setAiError("");
    setRecommendation("");
    setCopied(false);
    if (!columns?.length || !data?.length) {
      setAiError("No data uploaded. Please upload a dataset first.");
      setLoading(false);
      return;
    }
    try {
      const result = await askOpenAI(prompt, {
        temperature: 0.2,
        max_tokens: 240,
      });
      setRecommendation(result?.trim() || "No suggestion received.");
    } catch (err) {
      let msg = "OpenAI is not available. Please ensure the API key is valid and backend is running.";
      if (err?.message) msg += ` (${err.message})`;
      setAiError(msg);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setRecommendation("");
    setAiError("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (recommendation) {
      navigator.clipboard.writeText(recommendation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <Box
      sx={{
        my: 3,
        p: 3,
        bgcolor: "#fffbe8",
        borderRadius: 2,
        boxShadow: "0 2px 8px #fae0aa22",
        maxWidth: 700,
        mx: "auto",
        border: "1.5px solid #fae0aa55",
      }}
      aria-label="AI Chart Recommendation Panel"
    >
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <BarChartIcon sx={{ color: "#fa8000", fontSize: 30, mr: 1 }} />
        <Typography variant="h6" fontWeight={800} color="#fa8000" flex={1}>
          AI Chart Recommendation
        </Typography>
        {(recommendation || aiError) && (
          <Tooltip title="Reset">
            <IconButton size="small" onClick={handleReset}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Typography variant="body2" sx={{ color: "#7d6b33", mb: 2 }}>
        <b>What it does:</b> Instantly get a professional recommendation for the best chart to visualize the data.<br/>
        <b>Tip:</b> Upload the data first. The AI analyzes a sample of the actual table.
      </Typography>
      {aiError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {aiError}
        </Alert>
      )}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          onClick={handleRecommend}
          variant="contained"
          sx={{
            bgcolor: "#fa8000",
            fontWeight: 700,
            minWidth: 210,
            "&:disabled": { bgcolor: "#f7b86c" },
          }}
          disabled={loading || !columns?.length || !data?.length}
          startIcon={<BarChartIcon />}
          aria-label="Get AI Chart Recommendation"
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : (
            "Get Chart Recommendation"
          )}
        </Button>
      </Stack>
      {recommendation && (
        <Box
          sx={{
            mt: 3,
            bgcolor: "#fff",
            p: 2,
            borderRadius: 1.5,
            border: "1.5px solid #fae0aa88",
            boxShadow: "0 2px 8px #fae0aa22",
            position: "relative"
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography fontWeight={700} color="#1c4587" flex={1}>
              AI Suggests:
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton
                onClick={handleCopy}
                size="small"
                aria-label="Copy chart recommendation"
                sx={{ color: copied ? "#16a34a" : "#fa8000" }}
              >
                {copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <Typography
            sx={{ whiteSpace: "pre-line", color: "#24292f", fontSize: 16, lineHeight: 1.6 }}
            tabIndex={0}
          >
            {recommendation}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
