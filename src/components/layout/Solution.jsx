import TimeLine from '../ui/timelineDrawer';
import WaitingTimeTable from '../ui/waitingTimeTable.jsx';


const Solution = ({ problem }) => {

  return (
    <div>
        <TimeLine processes = {problem?.solution.schedule}/>
        <WaitingTimeTable processes={problem ? problem.question.processes : []}
                          actualWaitingTimes={problem? problem.solution.waitingTimes : {}}/>

    </div>
  );
};

export default Solution;