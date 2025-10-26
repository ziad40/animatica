import React , { useState }from 'react';
import NumberInput from './numberInput.jsx';

const WaitingTimeTable = ({ processes = [], actualWaitingTimes = {} }) => {
    // processes: [{ id, arrivalTime, burstTime }, ...]
    // processes: [{ processId, timeUnits }, ...]

    const [waitingTimes, setWaitingTimes] = useState({});

    const handleChangeWaitingTime = (pid, value) =>{
        setWaitingTimes(prev => ({
            ...prev,
            [pid]: value,
        }));
        console.log("waitingTimes");
        console.log(waitingTimes);
    }

    if (!processes || processes.length === 0) {
        return (
            <div className="p-4 text-sm text-gray-500"></div>
        );
    }

    return (
        // constrain height so the table fits in the Playground; make vertically scrollable when content overflows
        <div className="w-1/2 max-h-[60vh] overflow-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {processes.map((p, idx) => (
                        <tr key={p.id || p.processId} className="hover:bg-gray-50">
                            <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-700">{p.id || p.processId}</td>
                            {actualWaitingTimes[p.id || p.processId] !== undefined ? (
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-700">{actualWaitingTimes[p.id || p.processId]}</td>
                            ) : (
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-700">
                                    <NumberInput
                                        className="border p-1 m-0 text-sm"
                                        onSelect={(value) => {
                                            handleChangeWaitingTime(p.id || p.processId, value);
                                        }}
                                        value={waitingTimes[p.id || p.processId] ?? ''}
                                        placeholder={`Waiting Time of P${p.id || p.processId}`}
                                        />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WaitingTimeTable;