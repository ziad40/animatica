import React, { useState } from 'react';
import DropDown from '@/components/ui/dropDown';
import NumberInput from '@/components/ui/numberInput';
import ActionButton from '@/components/ui/ActionButton';
import { PlusCircle, Undo2 } from "lucide-react";
import TimeLine from '../ui/timelineDrawer';
const Playground = ({ problem , scheduledProcesses, setScheduledProcesses}) => {
  const [nextProcess, setNextProcess] = useState(null);
  const [nextTimeUnit, setNextTimeUnit] = useState(null);

  const handleAddProcess = () =>{
    const parsed = parseInt(nextTimeUnit, 10);
    if (nextProcess !== null && !Number.isNaN(parsed)) {
      const newScheduled = [
        ...scheduledProcesses,
        { processId: nextProcess, timeUnits: parsed },
      ];
      setScheduledProcesses(newScheduled);
      // log the new array (no async surprise)
      console.log('scheduledProcesses', newScheduled);
      // optionally reset selection
      setNextProcess(null);
      setNextTimeUnit(null);
    }
  }
  const handleUndo = () =>{
    if (scheduledProcesses.length > 0){
        const newScheduled = scheduledProcesses.slice(0, -1);
        setScheduledProcesses(newScheduled);
        console.log('scheduledProcesses', newScheduled);
      }
    }
  return (
    <div>
      <div className='m-4 flex flex-row items-center justify-left'>
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

      </div>
      <TimeLine processes={scheduledProcesses}/>
    </div>
    
  );
};

export default Playground;