// src/components/TaskItem.jsx

import React from 'react';

const TaskItem = ({ task, onStatusChange }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div className="flex items-center justify-between p-3 bg-[#0A1931] rounded-lg">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onStatusChange(task._id, isCompleted ? 'Pending' : 'Completed')}
          className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-600 cursor-pointer"
        />
        <div>
          <p className={`text-white ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.name}
          </p>
          <p className="text-xs text-gray-400">
            {/* Display the assigned attendee's name if it exists */}
            Assigned to: {task.assignedAttendee?.name || 'N/A'}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isCompleted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
        {task.status}
      </span>
    </div>
  );
};

export default TaskItem;