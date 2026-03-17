import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function CPUUtilizationChart({ results }) {
  // Transform results into chart data
  const chartData = results.map((result) => ({
    algorithm: result.algorithm,
    utilization: result.cpuUtilization,
  }));

  return (
    <div className='cpu-utilization-chart'>
      <h3>CPU Utilization Comparison</h3>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='algorithm' angle={-45} textAnchor='end' height={80} />
          <YAxis
            domain={[0, 100]}
            label={{
              value: 'Utilization (%)',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
            }}
          />
          <Legend />
          <Line
            type='monotone'
            dataKey='utilization'
            stroke='#3b82f6'
            dot={{ r: 6, fill: '#3b82f6' }}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name='CPU Utilization (%)'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CPUUtilizationChart;
