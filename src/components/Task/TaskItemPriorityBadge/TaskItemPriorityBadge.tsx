import React from "react";

export const TaskItemPriorityBadge = ({ priorityTask }) => {
  const { priority } = priorityTask;

  const renderClassesAccordingToPrority = () => {
    const classes = "text-xs rounded px-1 pb-0.5";

    if (priority === "High") {
      return classes + " text-danger border border-danger";
    }

    if (priority === "Medium") {
      return classes + " text-warning border border-warning";
    }

    if (priority === "Low") {
      return classes + " text-info border border-info";
    }

    if (priority === "Lowest") {
      return classes + " text-secondary border border-secondary";
    }

    return classes;
  };

  return <span className={renderClassesAccordingToPrority()}>{priority}</span>;
};