import React from "react";
import FileUpload from "./FileUpload";
import ChartBuilder from "./ChartBuilder";
import EDASummary from "./EDASummary";
import ExportPanel from "./ExportPanel";
import { useData } from "../context/DataContext";

export default function MainPanel({ selected }) {
  const { file } = useData();

  // Block access if no file uploaded
  if ((selected === "charts" || selected === "eda" || selected === "export") && !file) {
    return <FileUpload />;
  }

  if (selected === "charts") return <ChartBuilder />;
  if (selected === "eda") return <EDASummary />;
  if (selected === "export") return <ExportPanel />;
  return <FileUpload />;
}
