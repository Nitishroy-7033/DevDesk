import { useReducer } from "react";
import { Header } from "@/components/Header";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { ActiveTaskPanel } from "./components/ActiveTaskPanel";
import { UpcomingTasksPanel } from "./components/UpcomingTasksPanel";
import { useTheme } from "@/contexts/ThemeContext";
import { homeReducer, initialState } from "./context/Reducers";
import { toggleFullscreen } from "./context/Actions";
import "../../index.css";

const Home = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const { isFullscreen } = state;
  const { colors } = useTheme();

  const handleToggleFullscreen = () => {
    toggleFullscreen(dispatch);
  };

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
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>
      ) : (
        <>
          <main
            className="container mx-auto px-4 py-6 transition-all duration-500 ease-in-out animate-fadeIn"
            style={{
              color: colors.textColor,
            }}
          >
            <DemoModeBanner />
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              style={{ height: "calc(100vh - 140px)" }}
            >
              <ActiveTaskPanel
                isFullscreen={false}
                onToggleFullscreen={handleToggleFullscreen}
              />
              <UpcomingTasksPanel />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Home;
