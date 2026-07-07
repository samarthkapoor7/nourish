'use client';

import { useState } from 'react';
import { MOCK_WEEK } from '@/constants/mock-data';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

type Metric = 'calories' | 'protein' | 'budget';

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: 'calories', label: 'Calories', color: '#FC8019' },
  { key: 'protein', label: 'Protein', color: '#FF9A3C' },
  { key: 'budget', label: 'Budget', color: '#FFB366' },
];

function buildPath(
  data: number[],
  max: number,
  width: number,
  height: number,
  padding: number,
): string {
  const stepX = (width - padding * 2) / (data.length - 1);
  const points = data.map((value, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (value / max) * (height - padding * 2);
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}

export function WeeklyProgressChart() {
  const [activeMetric, setActiveMetric] = useState<Metric>('calories');

  const width = 600;
  const height = 200;
  const padding = 24;

  const calorieData = MOCK_WEEK.map((d) => d.calories);
  const proteinData = MOCK_WEEK.map((d) => d.proteinGrams);
  const budgetData = MOCK_WEEK.map((d) => d.spent);

  const dataMap: Record<Metric, number[]> = {
    calories: calorieData,
    protein: proteinData,
    budget: budgetData,
  };

  const data = dataMap[activeMetric];
  const max = Math.max(...data, 1);
  const activeColor = METRICS.find((m) => m.key === activeMetric)!.color;
  const path = buildPath(data, max, width, height, padding);

  return (
    <section className="dashboard-card animate-fade-in-up stagger-5 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Weekly Progress
        </h2>
        <div className="flex gap-2">
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              type="button"
              onClick={() => setActiveMetric(metric.key)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                activeMetric === metric.key
                  ? 'bg-[#FC8019] text-black'
                  : 'bg-[#252525] text-muted-foreground hover:text-foreground',
              )}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[400px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={padding}
              y1={height - padding - pct * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - pct * (height - padding * 2)}
              stroke="white"
              strokeOpacity="0.05"
            />
          ))}

          <path
            d={`${path} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
            fill="url(#chartGradient)"
          />

          <path
            d={path}
            fill="none"
            stroke={activeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 0,
            }}
          />

          {data.map((value, i) => {
            const stepX = (width - padding * 2) / (data.length - 1);
            const x = padding + i * stepX;
            const y = height - padding - (value / max) * (height - padding * 2);
            return (
              <circle
                key={MOCK_WEEK[i].day}
                cx={x}
                cy={y}
                r={MOCK_WEEK[i].isToday ? 6 : 4}
                fill={MOCK_WEEK[i].isToday ? '#FC8019' : activeColor}
                className="transition-all duration-300"
              />
            );
          })}

          {MOCK_WEEK.map((day, i) => {
            const stepX = (width - padding * 2) / (MOCK_WEEK.length - 1);
            const x = padding + i * stepX;
            return (
              <text
                key={day.day}
                x={x}
                y={height - 4}
                textAnchor="middle"
                className={cn(
                  'fill-current text-[10px]',
                  day.isToday ? 'text-[#FC8019] font-semibold' : 'text-muted-foreground',
                )}
              >
                {day.day}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
        {MOCK_WEEK.map((day) => (
          <div
            key={day.day}
            className={cn(
              'rounded-xl p-2',
              day.isToday ? 'bg-[#FC8019]/10' : 'bg-transparent',
            )}
          >
            <p className={cn('font-medium', day.isToday && 'text-[#FC8019]')}>
              {activeMetric === 'calories' && `${day.calories}`}
              {activeMetric === 'protein' && `${day.proteinGrams}g`}
              {activeMetric === 'budget' && formatCurrency(day.spent)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
