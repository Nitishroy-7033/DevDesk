import { useState } from "react";
import { Header } from "@/components/Header";
import { ActiveTaskPanel } from "@/components/ActiveTaskPanel";
import { UpcomingTasksPanel } from "@/components/UpcomingTasksPanel";
import { useTheme } from "@/contexts/ThemeContext";
import "../index.css";
const Index = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <div
      className="transition-all duration-500 ease-in-out"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: colors.bgColor,
        color: colors.textColor,
      }}
    >
      {isFullscreen ? (
        <div className="animate-fadeIn">
          <ActiveTaskPanel
            isFullscreen={true}
            onToggleFullscreen={() => setIsFullscreen(false)}
          />
        </div>
      ) : (
        <main
          className="container mx-auto px-4 py-6 transition-all duration-500 ease-in-out animate-fadeIn"
          style={{
            color: colors.textColor,
          }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <ActiveTaskPanel
              isFullscreen={false}
              onToggleFullscreen={() => setIsFullscreen(true)}
            />
            <UpcomingTasksPanel />
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
