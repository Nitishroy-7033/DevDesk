import { Table, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TasksTableView = ({ tasks, onTaskClick, onEditTask, onDeleteTask }) => {
  // Function to format repeat information
  const formatRepeatInfo = (task) => {
    if (!task.repeatCycleType) return "No repeat";

    if (task.repeatCycleType === "daily") {
      return "Daily";
    } else if (task.repeatCycleType === "weekly") {
      return "Weekly";
    } else if (task.repeatCycleType === "custom" && task.customRepeatDays) {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const selectedDays = task.customRepeatDays
        .map((dayIndex) => dayNames[dayIndex])
        .join(", ");
      return selectedDays || "Custom";
    }

    return task.repeatCycleType || "No repeat";
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a onClick={() => onTaskClick(record)}>{text}</a>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Repeat",
      dataIndex: "repeat",
      key: "repeat",
      render: (_, record) => formatRepeatInfo(record),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(record);
            }}
            title="Edit Task"
          />
          <Popconfirm
            title="Delete Task"
            description="Are you sure you want to delete this task?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDeleteTask(record.id);
            }}
            onCancel={(e) => {
              e?.stopPropagation();
              // Do nothing on cancel - just close the popconfirm
            }}
            okText="Yes"
            cancelText="No"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              title="Delete Task"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      onRow={(record) => {
        return {
          onClick: (event) => {
            // Only trigger task click if the click is not on an action button
            // Check if the clicked element or its parent has the class that indicates it's an action button
            const target = event.target;
            const isActionButton =
              target.closest(".ant-btn") ||
              target.closest(".ant-popover") ||
              target.closest('[role="tooltip"]');

            if (!isActionButton) {
              onTaskClick(record);
            }
          },
        };
      }}
      columns={columns}
      dataSource={tasks}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} tasks`,
      }}
    />
  );
};

export default TasksTableView;
