import React from "react";
import { Modal } from "antd";

const TaskDetailModal = ({ open, onClose, task }) => {
  return (
    <Modal title={task?.title} open={open} onCancel={onClose} footer={null}>
      {task ? (
        <div>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Start Time:</strong> {task.startTime}
          </p>
          <p>
            <strong>End Time:</strong> {task.endTime}
          </p>
          <p>
            <strong>Progress:</strong> {task.progress}%
          </p>
          <p>
            <strong>Date:</strong> {task.date.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>No task selected.</p>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
