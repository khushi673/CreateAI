'use client';

import React from 'react';

export const RevenueCostChart: React.FC<{ data: { month: string; revenue: number; cost: number }[]; height?: number }> = ({ data, height = 180 }) => {
  const max = Math.max(...data.map((d) => Math.max(d.revenue, d.cost)), 1);
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-4" style={{ height }}>
        {data.map((d) => (
          <div key={d.month} className="flex-1 h-full flex items-end justify-center gap-1">
            <div title={`Revenue $${Math.round(d.revenue).toLocaleString()}`} className="w-full max-w-[22px] rounded-t-md bg-rose-500 transition-all" style={{ height: `${(d.revenue / max) * 100}%` }} />
            <div title={`Cost $${Math.round(d.cost).toLocaleString()}`} className="w-full max-w-[22px] rounded-t-md bg-purple-500/80 transition-all" style={{ height: `${(d.cost / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 sm:gap-4 mt-2 border-t border-zinc-800 pt-2">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center text-[10px] font-bold text-zinc-500">{d.month}</div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-rose-500" />Revenue</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-purple-500/80" />AI cost</span>
      </div>
    </div>
  );
};
