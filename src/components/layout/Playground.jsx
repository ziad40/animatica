import React, { useState } from 'react';
import DropDown from '@/components/ui/dropDown';
import NumberInput from '@/components/ui/numberInput';
import ActionButton from '@/components/ui/ActionButton';
import { PlusCircle, Undo2, Send } from "lucide-react";
import TimeLine from '../ui/timelineDrawer';
import WaitingTimeTable from '../ui/waitingTimeTable.jsx';
import { Avatar } from '@/components/ui/Avatar';
import AssistantGif from "@/assets/gif/assistant.gif";
import AssistantPNG from "@/assets/images/assistant.png";
import { submitSolution } from "@/services/problemService";


const Playground = ({ problem , scheduledProcesses, setScheduledProcesses}) => {
  const [nextProcess, setNextProcess] = useState(null);
  const [nextTimeUnit, setNextTimeUnit] = useState(null);
  const [waitingTimes, setWaitingTimes] = useState({});
  const [averageWaitingTime, setaverageWaitingTime] = useState(null);

  const handleAddProcess = () =>{
    const parsed = parseInt(nextTimeUnit, 10);
    if (nextProcess !== null && !Number.isNaN(parsed)) {
      const newScheduled = [
        ...scheduledProcesses,
        { processId: nextProcess, timeUnits: parsed },
      ];
      setScheduledProcesses(newScheduled);
      // log the new array (no async surprise)
      // optionally reset selection
      setNextProcess(null);
      setNextTimeUnit(null);
    }
  }
  const handleUndo = () =>{
    if (scheduledProcesses.length > 0){
        const newScheduled = scheduledProcesses.slice(0, -1);
        setScheduledProcesses(newScheduled);
    }
  }

  const handleSolutionSubmit = async () => {
    // group scheduledProcesses, waitingTimes, averageWaitingTime into answer object
    const answer = {
      scheduledProcesses,
      waitingTimes,
      averageWaitingTime: parseFloat(averageWaitingTime),
    };
    await submitSolution(problem?.solution, answer);
  }
  return (
    <div className='bg-blue-50'>
      <div className='m-4 flex flex-row items-center justify-left bg-transparent'>
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
            setNextTimeUnit(value);
          }}
          value={nextTimeUnit ?? ''}
          placeholder="Time Units to Schedule"
        />

        {/* Add button - compute new array first so console shows updated value immediately */}
        <ActionButton
          variant="green"
          disabled={nextProcess === null || nextTimeUnit === null || nextTimeUnit === '' || Number.isNaN(parseInt(nextTimeUnit, 10))}
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
      <TimeLine processes={scheduledProcesses}/>

      {/* Main content row: left = average + waiting table, right = avatar */}
      <div className="m-4">
        <div className="flex flex-row items-start gap-6 w-full">
          {/* Left column: average box + waiting time table */}
          <div className="flex flex-col flex-1 gap-3">
            <WaitingTimeTable
              processes={problem ? problem.question.processes : []}
              waitingTimes={waitingTimes}
              setWaitingTimes={setWaitingTimes}
            />
            <div className="flex items-center bg-transparent border border-gray-200 rounded-sm p-3 shadow-sm max-w-md">
              <label htmlFor="averageWaitingTime" className="text-gray-700 text-sm font-medium mr-3">
                Total Average Waiting Time:
              </label>
              <NumberInput
                onSelect={setaverageWaitingTime}
                placeholder="Total Average Waiting Time"
                className="px-3 py-1.5 text-blue-700 font-semibold text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-right transition-all"
                value={averageWaitingTime}
                allowDecimal={true}
                decimalSeparator='.'
              />
            </div>
          </div>

          {/* Right column: avatar */}
          {problem && <div className="w-32 flex-shrink-0 flex items-start justify-center">
            <Avatar src = {AssistantPNG} hoverSrc={AssistantGif} size={150} alt="AI Assistant" title='AI Assistant options will be added'/>
          </div>}
        </div>
      </div>

    </div>
    
  );
};

export default Playground;