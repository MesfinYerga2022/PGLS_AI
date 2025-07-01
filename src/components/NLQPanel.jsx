import React, { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import {
  Box, TextField, Button, CircularProgress, Typography, Alert,
  Stack, IconButton, Tooltip, Divider, List, ListItem, ListItemText, Collapse
} from "@mui/material";
import { Send, Replay, Clear, QuestionAnswer, History } from "@mui/icons-material";
import { askOpenAI } from "../utils/openai";

export default function NLQPanel() {
  const { columns, data, nlqAnswer, setNlqAnswer } = useData();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputRef = useRef(null);

  // Ask OpenAI and update answer/history
  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAiError("");
    setNlqAnswer(""); // Clear previous
    const sample = [columns, ...data.slice(0, 20)];
    const prompt = [
      { role: "system", content: "You are a data expert. Answer questions about the following table as simply and clearly as possible." },
      { role: "user", content: `Table: ${JSON.stringify(sample)}. Question: ${question}` }
    ];
    try {
      const result = await askOpenAI(prompt);
      setNlqAnswer(result);
      setHistory(prev => [{ q: question, a: result }, ...prev].slice(0, 5));
      setQuestion("");
      inputRef.current?.focus();
    } catch (err) {
      setAiError("OpenAI not available. Please set up the API key in the .env file.");
      setNlqAnswer("");
    }
    setLoading(false);
  };

  // Allow Enter to submit (but not Shift+Enter)
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  // Reset the panel
  const handleReset = () => {
    setQuestion("");
    setAiError("");
    setNlqAnswer("");
    inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        my: 3,
        maxWidth: 700,
        mx: "auto",
        p: 3,
        bgcolor: "#fffbe8",
        borderRadius: 2,
        boxShadow: "0 2px 16px #fae0aa22"
      }}
      aria-label="Natural Language Data Q&A"
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <QuestionAnswer color="warning" sx={{ fontSize: 30 }} />
        <Typography variant="h6" fontWeight={800} color="#fa8000">
          Natural Language Data Q&A
        </Typography>
        <Tooltip title={showHistory ? "Hide History" : "Show History"}>
          <IconButton onClick={() => setShowHistory(h => !h)} color="warning" size="small" sx={{ ml: 1 }}>
            <History />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Example: <i>"What is the average revenue per country?"</i>
        <br />
        <b>Tip:</b> Ask about columns, stats, outliers, correlations, or patterns in the data.
      </Typography>

      {aiError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {aiError}
          <Button
            size="small"
            startIcon={<Replay />}
            onClick={handleAsk}
            sx={{ ml: 2 }}
            disabled={loading || !question}
          >
            Retry
          </Button>
        </Alert>
      )}

      <Stack direction="row" spacing={1} alignItems="flex-end">
        <TextField
          fullWidth
          inputRef={inputRef}
          multiline
          minRows={1}
          maxRows={3}
          label="Ask anything about the data"
          placeholder="Type a question and press Enter or click Ask"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <Tooltip title="Send">
                <span>
                  <IconButton
                    onClick={handleAsk}
                    color="warning"
                    disabled={loading || !question.trim()}
                    aria-label="Ask"
                  >
                    <Send />
                  </IconButton>
                </span>
              </Tooltip>
            )
          }}
          sx={{ bgcolor: "#fff", borderRadius: 2 }}
        />
        <Tooltip title="Reset">
          <span>
            <IconButton onClick={handleReset} disabled={loading} aria-label="Reset">
              <Clear />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <CircularProgress size={20} color="warning" />
          <Typography variant="body2" color="text.secondary">Waiting for AI answer...</Typography>
        </Stack>
      )}

      {nlqAnswer && !aiError && !loading && (
        <Box sx={{ mt: 2, bgcolor: "#fff", p: 2, borderRadius: 1, border: "1px solid #f7b86c" }}>
          <Typography fontWeight={700} color="#1c4587">AI Answer:</Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>{nlqAnswer}</Typography>
        </Box>
      )}

      {/* Q&A History */}
      <Collapse in={showHistory}>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <List dense>
          {history.length === 0 ? (
            <ListItem>
              <ListItemText primary="No Q&A history yet." />
            </ListItem>
          ) : (
            history.map((item, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography fontWeight={700}>
                      Q: {item.q}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      A: {item.a}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Collapse>
    </Box>
  );
}
