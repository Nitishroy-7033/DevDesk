import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TasksHeader = ({ onAddTask, onRefresh }) => {
  const navigate = useNavigate();

  return (
    <div className="tasks-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          onClick={() => navigate(-1)}
          style={{
            cursor: "pointer",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "10%",
            backgroundColor: "#323639",
          }}
        >
          <ArrowLeft className="icon" />
        </div>
        <h1
          onClick={onRefresh}
          className="tasks-title"
          style={{ cursor: "pointer" }}
        >
          Tasks
        </h1>
      </div>
      <Button onClick={onAddTask}>
        <Plus className="icon" /> Add
      </Button>
    </div>
  );
};

export default TasksHeader;
