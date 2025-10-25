import React from 'react';

const ProblemViewer = ({ processes = [] }) => {
    // processes: [{ id, arrivalTime, burstTime }, ...]

    if (!processes || processes.length === 0) {
        return (
            <div className="p-4 text-sm text-gray-500">No processes to display.</div>
        );
    }

    return (
        <div className="overflow-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {processes.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.arrivalTime}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.burstTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProblemViewer;