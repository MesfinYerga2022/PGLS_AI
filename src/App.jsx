import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useData } from "./context/DataContext";
import { getTheme } from "./theme";
import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import WelcomePanel from "./components/WelcomePanel";
import FileUpload from "./components/FileUpload";
import ChartBuilder from "./components/ChartBuilder";
import EDASummary from "./components/EDASummary";
import ExportPanel from "./components/ExportPanel";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

export default function App() {
  const [selected, setSelected] = React.useState("home");
  const { user } = useData();
  const theme = getTheme('light');

  const renderContent = () => {
    if (!user) return <WelcomePanel onNavigate={setSelected} />;
    if (!user.isApproved) return <WelcomePanel pending onNavigate={setSelected} />;
    switch (selected) {
      case "home":
        return <WelcomePanel onNavigate={setSelected} />;
      case "upload":
        return <FileUpload />;
      case "charts":
        return <ChartBuilder />;
      case "eda":
        return <EDASummary />;
      case "export":
        return <ExportPanel />;
      case "admin":
        return user.isAdmin ? <AdminPanel /> : <WelcomePanel onNavigate={setSelected} />;
      default:
        return <WelcomePanel onNavigate={setSelected} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.default
      }}>
        <AppHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <AppSidebar selected={selected} setSelected={setSelected} user={user} />
          <main style={{
            flex: 1,
            background: theme.palette.background.default,
            padding: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ 
              padding: "20px 24px 36px 24px", 
              marginTop: 0,
              maxWidth: "1400px",
              margin: "0 auto",
              width: "100%"
            }}>
              {renderContent()}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
