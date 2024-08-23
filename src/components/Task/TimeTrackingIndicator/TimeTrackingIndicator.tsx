import React from "react";

export const TimeTrackingIndicator = ({
  timeTrackingSpent,
  timeTrackingRemaining,
  spentWidth,
  barHeight = 4,
}) => {
  return (
    <>
      <div
        className="flex bg-secondary rounded overflow-hidden cursor-pointer"
        style={{ height: barHeight }}
      >
        <div className="bg-blue-600" style={{ width: `${spentWidth}%` }}></div>
      </div>
      <div className="d-flex justify-content-space-between">
        <div>{timeTrackingSpent}m logged</div>
        <div className="text-right">{timeTrackingRemaining}m remaining</div>
      </div>
    </>
  );
};