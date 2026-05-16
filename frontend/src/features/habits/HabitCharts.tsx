import React from 'react';
import { useHabitHistory } from '@/hooks/useExtras';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { motion } from 'framer-motion';

interface HabitChartsProps {
  habitId: number;
}

export const HabitCharts: React.FC<HabitChartsProps> = ({ habitId }) => {
  const { data: historyResponse, isLoading } = useHabitHistory(habitId, 30);

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center animate-pulse bg-[var(--social-bg)] rounded-2xl">Loading charts...</div>;
  }

  const history = historyResponse?.data || [];
  console.log("histroy",history);
  
  // Transform data for Trend Chart (Completion over time)
  const trendData = history.map((day: any) => ({
    date: day.date,
    status: day.status,
    completed: day.status === 'DONE' ? 1 : (day.status === 'PARTIAL' ? 0.5 : 0),
    expected: day.expected ? 1 : 0
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'PARTIAL': return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
      case 'SKIPPED': return 'bg-rose-500/40 border border-rose-500/20';
      case 'EXCEPTION': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]';
      case 'PENDING': return 'bg-gray-200 dark:bg-gray-700 border border-gray-300/70 dark:border-gray-600';
      case 'NOT_EXPECTED': return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-200 dark:bg-gray-700 border border-gray-300/70 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* 30-Day Heatmap */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold font-heading text-[var(--text-h)] mb-4 uppercase tracking-wider opacity-70">Last 30 Days Heatmap</h3>
          <div className="grid grid-cols-10 gap-2 w-fit mx-auto">
            {history.map((day: any, i: number) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`w-5 h-5 rounded-sm ${day.status === "NOT_EXPECTED" ? "bg-gray-300  dark:border-gray-700" : getStatusColor(day.status)} cursor-help relative group`}
                title={`${day.date}: ${day.status}`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {day.date}: {day.status}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] uppercase font-bold text-[var(--text)]">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-500" /> Done</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-400" /> Partial</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-rose-500" /> Skipped</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /> Exception</div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Trend */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold font-heading text-[var(--text-h)] mb-4 uppercase tracking-wider opacity-70">Consistency Trend</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  hide 
                />
                <YAxis hide domain={[0, 1.2]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg)] border border-[var(--border)] p-2 rounded-lg shadow-xl text-xs">
                          <p className="font-bold">{data.date}</p>
                          <p className="text-[var(--accent)] font-mono uppercase">{data.status}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="var(--accent)" 
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
