import TimeLine from '../ui/timelineDrawer';
import WaitingTimeTable from '../ui/waitingTimeTable.jsx';
import React, { useState } from 'react';


const Solution = ({ problem }) => {
  const [waitingTimes, setWaitingTimes] = useState({});
  
  
  return (
    <div className='bg-green-50'>
        <TimeLine processes = {problem?.solution.schedule} colorMap = {problem?.colorMap}/>
        <WaitingTimeTable processes={problem ? problem.question.processes : []}
                          actualWaitingTimes={problem? problem.solution.waitingTimes : {}}
                          waitingTimes={waitingTimes}
                          setWaitingTimes = {setWaitingTimes}
                        />
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-x p-2 shadow-sm max-w-md mx-auto">
          <span className="text-gray-700 text-sm font-medium">
            Total Average Waiting Time:
          </span>
          <span className="text-blue-600 font-semibold text-sm">
            {problem ? `${problem.solution.averageWaitingTime.toFixed(2)} time units` : '--'}
          </span>
        </div>


    </div>
  );
};

export default Solution;