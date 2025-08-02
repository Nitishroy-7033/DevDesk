import { Table } from "antd";

const TasksTableView = ({ tasks, onTaskClick }) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
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
      dataIndex: "repeatCycleType",
      key: "RepeatCycleType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <Table
      rowKey="id"
      onRow={(record) => {
        return {
          onClick: () => onTaskClick(record),
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
