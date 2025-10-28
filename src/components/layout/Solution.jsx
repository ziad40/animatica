import TimeLine from '../ui/timelineDrawer';
import WaitingTimeTable from '../ui/waitingTimeTable.jsx';
import React, { useState } from 'react';
import ActionButton from '../ui/ActionButton';

const Solution = ({ problem }) => {
  const [waitingTimes, setWaitingTimes] = useState({});
  const [operations, setOperations] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  return (
    <>
    {
      showSolution && problem ?
        (
          <div className="flex flex-col items-center gap-1 my-4">
              <ActionButton
                variant="primary"
                onClick={() => setShowSolution(false)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
              >
                Hide Solution
              </ActionButton>
              <TimeLine processes = {problem?.solution.schedule} colorMap = {problem?.colorMap}/>
              <WaitingTimeTable processes={problem ? problem.question.processes : []}
                                actualWaitingTimes={problem? problem.solution.waitingTimes : {}}
                                waitingTimes={waitingTimes}
                                setWaitingTimes = {setWaitingTimes}
                                actualOperations={problem? problem.solution.operations : {}}
                                operations={operations}
                                setOperations = {setOperations}
                              />
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-x p-2 shadow-sm max-w-md mx-auto">
                <span className="text-gray-700 text-sm font-medium">
                  Total Average Waiting Time :  
                </span>
                <span className="text-blue-600 font-semibold text-sm">
                  {problem ? `${problem.solution.averageWaitingTime.toFixed(2)} time units` : '--'}
                </span>
              </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ActionButton
              variant="primary"
              onClick={() => setShowSolution(true)}
              className="mt-4"
            >
              Show Solution
            </ActionButton>
          </div>
        )
    }
    </>
  );
};

export default Solution;