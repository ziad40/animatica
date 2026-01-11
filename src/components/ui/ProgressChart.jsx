import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const buildProgressChartData = (progressRate) => {
    if (!progressRate) return [];

    const types = Object.keys(progressRate);
    const maxLength = Math.max(
      ...types.map(type => progressRate[type].length)
    );

    const data = [];
    for (let i = 0; i < maxLength; i++) {
      const row = { step: i + 1 };
      types.forEach(type => {
        row[type] = progressRate[type][i] ?? null;
      });
      data.push(row);
    }

    return data;
  };

const ProgressChart = ({ progressRate }) => {
  const data = buildProgressChartData(progressRate);

  if (!data.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Progress Over Time
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="step"
            label={{ value: "Attempt", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            formatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Legend />

          <Line type="monotone" dataKey="fcfs" stroke="#2563eb" />
          {/* <Line type="monotone" dataKey="rr" stroke="#16a34a" />
          <Line type="monotone" dataKey="sjf" stroke="#dc2626" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;