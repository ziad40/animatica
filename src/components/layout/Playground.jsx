import React, { useState } from 'react';
import DropDown from '@/components/ui/dropDown';
import NumberInput from '@/components/ui/numberInput';
const Playground = ({ problem }) => {
  const [scheduledProcesses, setScheduledProcesses] = useState([]);
  const [nextProcess, setNextProcess] = useState(null);
  const [nextTimeUnit, setNextTimeUnit] = useState(null);


  return (
    <div>
        <DropDown
          options={
            problem ? [{ label: "empty", value: "" },
               ...problem.question.processes.map(p => ({ label: `P${p.id} `, value: p.id }))]
           : []}
          onSelect={(value) => {
            setNextProcess(value.value);
          }}
          className="m-4 w-full"
          buttonClassName="w-full text-left"
          placeholder="Next Process to Schedule"
        />
        <NumberInput
          onSelect={(value) => {
            setNextTimeUnit(value);
          }}
        />
    </div>
  );
};

export default Playground;