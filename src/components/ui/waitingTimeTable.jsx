import React from 'react';
import NumberInput from './numberInput.jsx';

const WaitingTimeTable = ({
    processes = [],
    actualWaitingTimes = {},
    actualOperations = {},
    waitingTimes,
    setWaitingTimes,
    operations,
    setOperations
    }) => {

    const handleChangeWaitingTime = (pid, value) => {
        if (value === '') return;
        setWaitingTimes(prev => ({
        ...prev,
        [pid]: parseFloat(value),
        }));
    };

    const handleChangeOperations = (pid, value) => {
        setOperations(prev => ({
        ...prev,
        [pid]: value,
        }));
    };

    if (!processes || processes.length === 0) {
        return <div className="p-4 text-sm text-gray-500"></div>;
    }

    return (
        <div className="w-full max-h-[60vh] overflow-y-auto bg-transparent">
        <table className="w-full border-collapse table-fixed divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
            <tr>
                <th className="w-[20%] px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Process
                </th>
                <th className="w-[50%] px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calculation
                </th>
                <th className="w-[30%] px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waiting Time
                </th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
            {processes.map((p) => {
                const pid = p.id || p.processId;
                return (
                <tr key={pid} className="hover:bg-gray-50">
                    <td className="px-2 py-1 text-sm text-gray-700 truncate">
                    <strong>P{pid}</strong>
                    </td>

                    <td className="px-2 py-1 text-sm text-gray-700">
                    {actualOperations[pid] !== undefined ? (
                        <span className="block truncate">{actualOperations[pid]}</span>
                    ) : (
                        <input
                        type="text"
                        value={operations[pid] ?? ""}
                        onChange={(e) => handleChangeOperations(pid, e.target.value)}
                        placeholder={`P${pid} calc`}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}
                    </td>

                    <td className="px-2 py-1 text-sm text-gray-700">
                    {actualWaitingTimes[pid] !== undefined ? (
                        <span>{actualWaitingTimes[pid]}</span>
                    ) : (
                        <NumberInput
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onSelect={(value) => handleChangeWaitingTime(pid, value)}
                        value={waitingTimes[pid] ?? ''}
                        placeholder={`P${pid} WT`}
                        />
                    )}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    );
};

export default WaitingTimeTable;
