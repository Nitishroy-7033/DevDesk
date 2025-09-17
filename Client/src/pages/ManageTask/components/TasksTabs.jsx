import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Filter, List } from "lucide-react";
import TasksCalendarView from "@/components/Tasks/TasksCalendarView";
import TasksTableView from "@/components/Tasks/TasksTableView";

const TasksTabs = ({
  activeView,
  onViewChange,
  selectedDate,
  onDateSelect,
  calendarTasks,
  allTasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  formatTime,
}) => {
  return (
    <Tabs value={activeView} onValueChange={onViewChange}>
      <div className="tabs-header">
        <TabsList>
          <TabsTrigger value="table">
            <List className="icon" /> Table
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="icon" /> Calendar
          </TabsTrigger>
        </TabsList>
        <Button variant="outline" className="filter-btn">
          <Filter className="icon" /> Filter
        </Button>
      </div>

      <TabsContent value="calendar">
        <TasksCalendarView
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          calendarTasks={calendarTasks}
          formatTime={formatTime}
        />
      </TabsContent>

      <TabsContent value="table">
        <TasksTableView
          tasks={allTasks}
          onTaskClick={onTaskClick}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TasksTabs;
