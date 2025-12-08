import React, { useState, useEffect } from 'react';
import DropDown from '@/components/ui/dropDown';
import NumberInput from '@/components/ui/numberInput';
import ActionButton from '@/components/ui/ActionButton';
import { PlusCircle, Undo2, Send, CheckCircle, Repeat } from "lucide-react";
import Avatar from '../ui/Avatar';
import AssistantGif from "@/assets/gif/assistant.gif";
import TimeLine from '../ui/timelineDrawer';
import WaitingTimeTable from '../ui/waitingTimeTable.jsx';
import { submitSolution } from "@/services/problemService";
import { useOverlay } from "@/context/OverlayContextCard";
import { Assistant } from '../ui/Assistant';

const Playground = ({ problem , currentProblemId, setCurrentProblemId }) => {
  const [scheduledProcesses, setScheduledProcesses] = useState([]);
  const [submitted, setSubmitted] = useState(false);                     
  const [nextProcess, setNextProcess] = useState(null);
  const [nextEndTimeUnit, setNextEndTimeUnit] = useState(null);
  const [currentTime, setCurrentTime] = useState([0]);
  const [waitingTimes, setWaitingTimes] = useState({});
  const [operations, setOperations] = useState({});
  const [averageWaitingTime, setaverageWaitingTime] = useState(null);
  const { showOverlay } = useOverlay();
  const tolerance = 0.01;
  const CORRECT_ANSWER_STYLE = 'bg-green-300'
  const WRONG_ANSWER_STYLE = 'bg-red-300'

  useEffect(() => {
    setScheduledProcesses([]);
    setCurrentProblemId(null);
    setSubmitted(false);
    setNextProcess(null);
    setNextEndTimeUnit(null);
    setCurrentTime([0]);
    setWaitingTimes({});
    setOperations({});
    setaverageWaitingTime(null);
  }, [problem]);

  const handleAddProcess = () =>{
    const parsed = parseInt(nextEndTimeUnit, 10);
    if (nextProcess !== null && !Number.isNaN(parsed) && parsed > currentTime[currentTime.length-1]) {
      const newScheduled = [
        ...scheduledProcesses,
        { processId: nextProcess, timeUnits: parsed - currentTime[currentTime.length-1] },
      ];
      setScheduledProcesses(newScheduled);
      // reset selection
      setNextProcess(null);
      setNextEndTimeUnit(null);
      setCurrentTime (prev => [...prev, parsed]);
    }
  }
  const handleUndo = () =>{
    if (scheduledProcesses.length > 0){
        const newScheduled = scheduledProcesses.slice(0, -1);
        setScheduledProcesses(newScheduled);
        const newCurrentTime = currentTime.slice(0, -1);
        setCurrentTime(newCurrentTime);
    }
  }

  const handleSolutionSubmit = async () => {
    // group scheduledProcesses, waitingTimes, averageWaitingTime into answer object
    const answer = {
      scheduledProcesses,
      waitingTimes,
      operations,
      averageWaitingTime: parseFloat(averageWaitingTime),
    };
    try {
      let response = await submitSolution(currentProblemId, problem, answer);

      if (response?.problemId) setCurrentProblemId(response.problemId);
      setSubmitted(true);
      return response;
    } catch (err) {
      console.error('Failed to submit solution from Playground:', err);
      throw err;
    } finally{
      showOverlay(
        <div className="flex flex-col items-center space-y-2">
          <Avatar src = {AssistantGif} size={300} alt="AI Assistant" />
          <CheckCircle size={48} className="text-green-500" />
          <h2 className="text-xl font-semibold">Good Trial</h2>
          <p className="text-gray-600">Your solution has been recorded!</p>
        </div>,
        3000 // show for 3 seconds
      );
    }
  }
  return (
    <div>
      <div className='m-4 flex flex-row flex-wrap items-center justify-start bg-transparent'>
        <DropDown
          options={
            problem ? [{ label: "idle", value: -1 },
              ...problem.question.processes.map(p => ({ label: `P${p.id} `, value: p.id }))]
          : []}
          selectedValue={nextProcess}
          onSelect={(option) => {
            // option is the selected option object
            setNextProcess(option?.value ?? null);
          }}
          placeholder="Next Process to Schedule"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        />
        <NumberInput
          onSelect={(value) => {
            setNextEndTimeUnit(value);
          }}
          value={nextEndTimeUnit ?? ''}
          placeholder="End Time of Process"
        />

        {/* Add button - compute new array first so console shows updated value immediately */}
        <ActionButton
          variant="green"
          disabled={nextProcess === null || nextEndTimeUnit === null || nextEndTimeUnit === '' || Number.isNaN(parseInt(nextEndTimeUnit, 10)) || parseInt(nextEndTimeUnit, 10) <= currentTime[currentTime.length-1]}
          onClick={handleAddProcess}
          title="Add next process"
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline">Add</span>
        </ActionButton>

        {/* Undo button */}
        <ActionButton
          variant="red"
          disabled={scheduledProcesses.length === 0}
          onClick={handleUndo}
          title="Undo last scheduled process"
        >
          <Undo2 size={18} />
          <span className="hidden sm:inline">Undo</span>
        </ActionButton>
        
        {/* retry button */}
        {submitted && (
          <ActionButton
            variant="retry"
            onClick={() => setSubmitted(false)}
            title="Retry your Answer"
            className='ml-auto'
          >
            <Repeat size={18} />
            <span className="hidden sm:inline">Retry</span>
          </ActionButton>
        )}
        

        {/* submit button */}
        <ActionButton
          variant="submit"
          disabled={problem == null}
          onClick={handleSolutionSubmit}
          title="submit Your Answer"
          className='ml-auto'
        >
          <Send size={18} />
          <span className="hidden sm:inline">Submit</span>
        </ActionButton>

      </div>
      <TimeLine processes={scheduledProcesses} actualProcesses={problem?.solution.schedule} submitted={submitted}/>

      {/* Main content row: left = average + waiting table, right = avatar */}
      <div className="m-4">
        <div className="flex flex-col md:flex-row items-start gap-6 w-full">
          {/* Left column: average box + waiting time table */}
          <div className="flex flex-col flex-1 gap-3">
            <WaitingTimeTable
              processes={problem ? problem.question.processes : []}
              actualWaitingTimes={problem?.solution.waitingTimes}
              actualOperations={problem?.solution.operations}
              waitingTimes={waitingTimes}
              setWaitingTimes={setWaitingTimes}
              operations={operations}
              setOperations={setOperations}
              submitted={submitted}
            />
            <div className="flex items-center bg-transparent border border-gray-200 rounded-sm p-3 shadow-sm max-w-md">
              <label htmlFor="averageWaitingTime" className="text-gray-700 text-sm font-medium mr-3">
                Total Average Waiting Time:
              </label>
              <NumberInput
                onSelect={setaverageWaitingTime}
                placeholder="Total Average Waiting Time"
                className={`px-3 py-1.5 text-blue-700 font-semibold text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-right transition-all ${
                  submitted
                    ? Math.abs(averageWaitingTime - problem.solution.averageWaitingTime) <= tolerance
                      ? CORRECT_ANSWER_STYLE
                      : WRONG_ANSWER_STYLE
                    : ''
                }`}
                value={averageWaitingTime}
                allowDecimal={true}
                decimalSeparator="."
              />

            </div>
          </div>

          {/* Right column: avatar */}
          {problem && <div className="w-full md:w-32 flex-shrink-0 flex items-start justify-center">
            <Assistant 
              problem = {problem}
              scheduledProcesses = {scheduledProcesses}
              waitingTimes={waitingTimes}
              operations={operations}
              averageWaitingTime={averageWaitingTime}
            />
          </div>}
        </div>
      </div>

    </div>
    
  );
};

export default Playground;