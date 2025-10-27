import React from "react";

// component that have scheduledProcesses to draw represent them in time line
const TimeLine = ({ processes = [], colorMap = {} }) => {
  // defensive: ensure processes is an array
  const totalUnitTime = processes.reduce((sum, p) => sum + (Number(p.timeUnits) || 0), 0);

  // If totalUnitTime is 0, each item will get 0% width — we fall back to an equal distribution
  const fallbackWidth = processes.length > 0 ? 100 / processes.length : 100;

  return (
    // use nowrap + overflow so the timeline stays a single horizontal bar and items don't push layout
    <div className="flex flex-col p-2 border-2 border-dashed w-full mt-2 mb-2">
      <div className="flex flex-row flex-nowrap items-stretch" role="list" aria-label="timeline" title="Processes Time Line">
        {processes.map((p, idx) => (
          <ProcessItem
            key={idx}
            process={p}
            totalUnitTime={totalUnitTime}
            fallbackWidth={fallbackWidth}
            colorMap={colorMap}
          />
        ))}
      </div>
      {/* time ticks row */}
      {totalUnitTime > 0 ? (
        <div className="relative mt-2 h-10 w-full" aria-hidden="false">
          {(() => {
            const maxTicks = 20;
            const step = totalUnitTime <= maxTicks ? 1 : Math.ceil(totalUnitTime / maxTicks);
            const ticks = [];
            for (let t = 0; t <= totalUnitTime; t += step) {
              const leftPct = (t / totalUnitTime) * 100;
              ticks.push({ time: t, leftPct });
            }
            if (ticks.length === 0 || ticks[ticks.length - 1].time !== totalUnitTime) {
              ticks.push({ time: totalUnitTime, leftPct: 100 });
            }
            return ticks.map((tk, i) => (
              <div
                key={i}
                style={{ position: 'absolute', left: `${tk.leftPct}%`, transform: 'translateX(-50%)' }}
                className="flex flex-col items-center"
              >
                <div style={{ width: 1, height: 6, background: '#6f7277ff' }} />
                <div className="text-xs text-gray-600 mt-1">{tk.time}</div>
              </div>
            ));
          })()}
        </div>
      ) : (
        <div className="mt-2 text-xs text-gray-500">No scheduledProcesses</div>
      )}
    </div>
  );
};

const ProcessItem = ({ process, totalUnitTime, fallbackWidth, colorMap = null }) => {
  const units = Number(process?.timeUnits) || 0;
  const pct = totalUnitTime > 0 ? (units / totalUnitTime) * 100 : fallbackWidth;
  const label = process?.processId != null && process.processId !== -1 ? `P${process.processId}` : 'idle';

  return (
    <div
      role="listitem"
      className="border-2 border-solid flex items-center justify-center px-2 text-sm bg-gray-50 h-1/2"
      // only set inline backgroundColor when a colorMap is provided; otherwise keep the tailwind bg-gray-50
      style={{ width: `${pct}%`, backgroundColor: colorMap && process?.processId !== -1 ? (colorMap[process.processId] || '#9CA3AF') : undefined }}
      title={`${label} — ${units} unit${units !== 1 ? 's' : ''}`}
    >
      {label}
    </div>
  );
};

export default TimeLine;