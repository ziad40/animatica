import React from "react";
import TimeLine from "@/components/ui/timelineDrawer";
import WaitingTimeTable from "@/components/ui/waitingTimeTable";

const AttemptDetails = ({ attempt, questionDetails }) => {
  const { trialAnswer, score, createdAt } = attempt;
  const { question, solution } = questionDetails;

  // Color map for processes
  const colorMap = {
    1: '#3B82F6', // blue
    2: '#EF4444', // red
    3: '#10B981', // green
    4: '#F59E0B', // yellow
    5: '#8B5CF6', // purple
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">
          <strong>Score:</strong> {(score * 100).toFixed(2)}% | <strong>Date:</strong> {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      <div className="space-y-4">
        {/* Scheduled Processes Timeline */}
        {trialAnswer.scheduledProcesses && trialAnswer.scheduledProcesses.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Scheduled Processes</h4>
            <TimeLine
              processes={trialAnswer.scheduledProcesses}
              colorMap={colorMap}
              actualProcesses={solution?.schedule || []}
              submitted={true}
            />
          </div>
        )}

        {/* Waiting Times Table */}
        {(trialAnswer.waitingTimes || trialAnswer.operations) && (
          <div>
            <h4 className="font-medium mb-2">Waiting Times & Operations</h4>
            <WaitingTimeTable
              processes={question?.processes || []}
              actualWaitingTimes={solution?.waitingTimes || {}}
              actualOperations={solution?.operations || {}}
              waitingTimes={trialAnswer.waitingTimes || {}}
              operations={trialAnswer.operations || {}}
              submitted={true}
              solved={false}
            />
          </div>
        )}

        {/* Average Waiting Time */}
        {trialAnswer.averageWaitingTime !== null && trialAnswer.averageWaitingTime !== undefined && (
          <div className="bg-white p-3 rounded">
            <strong>Average Waiting Time:</strong> {trialAnswer.averageWaitingTime.toFixed(2)}
            {solution?.averageWaitingTime && (
              <span className="ml-4 text-sm text-gray-600">
                (Correct: {solution.averageWaitingTime.toFixed(2)})
              </span>
            )}
          </div>
        )}

        {/* Raw Data (fallback) */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">Raw Trial Answer Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(trialAnswer, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default AttemptDetails;