import React from 'react';

const ProblemViewer = ({ processes = [], type = "", timeQuantum = null }) => {
    // processes: [{ id, arrivalTime, burstTime, priority? }, ...]

    if (!processes || processes.length === 0) {
        return (
            <div className="p-4 text-sm text-gray-500">No processes to display.</div>
        );
    }

    const isPriority = type === "priority";
    const isRoundRobin = type === "Round-Robin";

    return (
        <div className="overflow-auto w-full">
            {isRoundRobin && timeQuantum && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Time Quantum: <strong>{timeQuantum}</strong></p>
                </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                        {isPriority && (
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {processes.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"><strong>P{p.id}</strong></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.arrivalTime}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.burstTime}</td>
                            {isPriority && (
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.priority}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProblemViewer;