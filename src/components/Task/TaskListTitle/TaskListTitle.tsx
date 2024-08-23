import React from "react";

export const TaskListTitle = ({ title }) => {
  const renderClassesAccordingToTitle = () => {
    const classes = "d-inline-block px-2 py-0.5 mb-1 text-white rounded";

    if (title === "BACKLOG") {
      return classes + " bg-secondary";
    }

    if (title === "SELECTED FOR DEVELOPMENT") {
      return classes + " bg-info";
    }

    if (title === "IN PROGRESS") {
      return classes + " bg-primary";
    }

    if (title === "DONE") {
      return classes + " bg-success";
    }

    return classes;
  };
  return (
    <div>
      <span className={renderClassesAccordingToTitle()}>{title}</span>
    </div>
  );
};