import React from 'react';
import { useGlobalMetrics } from '@/hooks/useMetrics';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export const DashboardCharts: React.FC = () => {
  const { data: metricsResponse, isLoading } = useGlobalMetrics(30);

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center animate-pulse bg-[var(--social-bg)] rounded-2xl">Analyzing your progress...</div>;
  }

  const data = metricsResponse?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Global Completion Trend */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-heading text-[var(--text-h)]">Completion Trend</h3>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/10 px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text)', opacity: 0.5 }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text)', opacity: 0.5 }}
                  unit="%"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl shadow-2xl text-xs">
                          <p className="font-bold mb-1">{d.date}</p>
                          <p className="text-[var(--accent)] font-mono text-lg">{d.completionRate}%</p>
                          <p className="text-[var(--text)] opacity-60">{d.completedCount} / {d.expectedCount} habits</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="var(--accent)" 
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                  strokeWidth={3}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Volume Bar Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-heading text-[var(--text-h)]">Check-in Volume</h3>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Activity</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text)', opacity: 0.5 }}
                  minTickGap={30}
                />
                <YAxis 
                   axisLine={false}
                   tickLine={false}
                   tick={{ fontSize: 10, fill: 'var(--text)', opacity: 0.5 }}
                />
                <Tooltip 
                   cursor={{ fill: 'var(--social-bg)', opacity: 0.4 }}
                   content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl shadow-2xl text-xs">
                          <p className="font-bold mb-1">{d.date}</p>
                          <p className="text-emerald-500 font-mono text-lg">{d.completedCount} Completed</p>
                          <p className="text-[var(--text)] opacity-60">Out of {d.expectedCount} expected</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="completedCount" 
                  fill="var(--accent)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
