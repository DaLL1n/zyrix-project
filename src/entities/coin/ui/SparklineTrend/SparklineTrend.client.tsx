'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';
import type { Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';

type ShadowLineOptions = {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetY?: number;
};

const getShadowLineOptions = (chart: Chart): ShadowLineOptions => {
  const plugins = chart.options.plugins as
    | (Record<string, unknown> & { shadowLine?: ShadowLineOptions })
    | undefined;

  return plugins?.shadowLine ?? {};
};

const shadowLinePlugin = {
  id: 'shadowLine',
  beforeDatasetsDraw: (chart: Chart) => {
    const ctx = chart.ctx;
    ctx.save();
    const opts = getShadowLineOptions(chart);
    ctx.shadowColor = opts.shadowColor || '#000';
    ctx.shadowBlur = opts.shadowBlur || 0;
    ctx.shadowOffsetY = opts.shadowOffsetY || 8;
  },
  afterDatasetsDraw: (chart: Chart) => {
    chart.ctx.restore();
  },
};

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  shadowLinePlugin,
);

export const SparklineTrend = ({ priceChange }: { priceChange: number[] }) => {
  const pointsPerHour = priceChange.length / 168;
  const last24hCount = Math.round(pointsPerHour * 24);
  const last24h = priceChange.slice(-last24hCount);

  const isProfit = last24h[last24h.length - 1] > last24h[0];
  const lineColor = isProfit ? '#4CAF50' : '#D32F2F';
  const shadowColor = isProfit
    ? 'rgba(0, 195, 43, 0.3)'
    : 'rgba(255, 52, 52, 0.3)';

  const data = {
    labels: last24h.map((_, i) => i),
    datasets: [
      {
        data: last24h,
        borderColor: lineColor,
        borderWidth: 1.6,
        fill: false,
        pointRadius: 0,
        tension: 0.38,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      shadowLine: {
        shadowColor,
        shadowBlur: 18,
        shadowOffsetY: 4,
      },
    },
    scales: { x: { display: false }, y: { display: false } },
  };

  return <Line data={data} options={options} width={150} height={48} />;
};
