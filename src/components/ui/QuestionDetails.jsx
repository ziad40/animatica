import React from "react";
import TimeLine from "@/components/ui/timelineDrawer";
import WaitingTimeTable from "@/components/ui/waitingTimeTable";

const QuestionDetails = ({ questionDetails }) => {
  const { type, question, solution } = questionDetails;

  // Color map for processes
  const colorMap = {
    1: '#3B82F6', // blue
    2: '#EF4444', // red
    3: '#10B981', // green
    4: '#F59E0B', // yellow
    5: '#8B5CF6', // purple
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Question Details</h3>

      <div className="mb-4">
        <strong>Type:</strong> {type}
      </div>

      {/* Question Processes */}
      {question?.processes && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Processes</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-sm font-medium">Process ID</th>
                  <th className="px-3 py-2 text-left text-sm font-medium">Arrival Time</th>
                  <th className="px-3 py-2 text-left text-sm font-medium">Burst Time</th>
                </tr>
              </thead>
              <tbody>
                {question.processes.map((process) => (
                  <tr key={process.id} className="border-t">
                    <td className="px-3 py-2 text-sm">P{process.id}</td>
                    <td className="px-3 py-2 text-sm">{process.arrivalTime}</td>
                    <td className="px-3 py-2 text-sm">{process.burstTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Solution */}
      {solution && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Correct Solution</h4>

          {/* Schedule Timeline */}
          {solution.schedule && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Schedule:</div>
              <TimeLine processes={solution.schedule} colorMap={colorMap} />
            </div>
          )}

          {/* Waiting Times & Operations */}
          {(solution.waitingTimes || solution.operations) && (
            <div className="mb-3">
              <WaitingTimeTable
                processes={question?.processes || []}
                waitingTimes={solution.waitingTimes || {}}
                operations={solution.operations || {}}
                submitted={false}
                solved={true}
              />
            </div>
          )}

          {/* Average Waiting Time */}
          {solution.averageWaitingTime !== undefined && (
            <div className="bg-green-50 p-3 rounded">
              <strong>Average Waiting Time:</strong> {solution.averageWaitingTime.toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Raw Data */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-500">Raw Question Data</summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify({ type, question, solution }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default QuestionDetails;