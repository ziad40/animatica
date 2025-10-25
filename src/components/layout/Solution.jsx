import TimeLine from '../ui/timelineDrawer';


const Solution = ({ problem }) => {

  return (
    <div>
        <TimeLine processes = {problem?.solution.schedule}/>
    </div>
  );
};

export default Solution;