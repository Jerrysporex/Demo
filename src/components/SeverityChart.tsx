import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SeverityChartProps {
  data: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const SeverityChart: React.FC<SeverityChartProps> = ({ data }) => {
  const chartData: ChartData<'doughnut'> = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [data.critical, data.high, data.medium, data.low],
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            return `${label}: ${value}`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="aspect-square max-w-full p-4">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default SeverityChart;