import DropDown from "../ui/dropDown";
import ProblemViewer from "../ui/problemViewer";
import React, { useState } from 'react';
import { getProblem } from "@/services/problemService";

const Problem = ({ problem, setProblem }) => {
  const [problemType, setProblemType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setError("");

    if (!problemType) {
      setError("Please choose a problem type before generating.");
      return;
    }

    try {
      setLoading(true);
      const data = await getProblem(problemType);
      // store result in problem
      setProblem(data);
      console.log(data)
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problem. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-4 bg-white rounded shadow">
      <DropDown
        options={[
          { label: "First Come First Serve", value: "FCFS" },
        ]}
        onSelect={(value) => {
          setProblemType(value.value);
        }}
        className="m-4 w-full"
        buttonClassName="w-full text-left"
        placeholder="Choose Scheduling Algorithm"
      />

      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded ${loading ? 'bg-gray-300 text-gray-700' : 'bg-black text-white'}`}
      >
        {loading ? 'Generating...' : 'Generate Problem'}
      </button>
      {problem && (
        <div>
            <p>arrange the following processes according to {problem.type } algorithm and calculate the average waiting time and average turnaround time.</p>
            <br></br>
            <p>Break Tie by process ID</p>
            <ProblemViewer processes={problem.question.processes } />
        </div>
        )}
    </div>
  );
};

export default Problem;