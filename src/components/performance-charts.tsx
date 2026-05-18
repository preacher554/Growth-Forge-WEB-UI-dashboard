"use client";

import { Target } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PerformanceChartsProps = {
  charts: {
    followerGrowth: ReadonlyArray<{ day: string; followers: number; target: number }>;
    dailyGrowth: ReadonlyArray<{ day: string; growth: number }>;
    postsPublished: ReadonlyArray<{ week: string; posts: number }>;
    reachTrend: ReadonlyArray<{ day: string; reach: number }>;
  };
};

export function PerformanceCharts({ charts }: PerformanceChartsProps) {
  return (
    <>
      <ChartCard title="Follower growth over time + target line">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={charts.followerGrowth}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
            <YAxis stroke="rgba(255,255,255,0.35)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="followers"
              stroke="#ff3b00"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ffffff"
              strokeDasharray="6 6"
              strokeOpacity={0.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Daily growth bars">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={charts.dailyGrowth}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
            <YAxis stroke="rgba(255,255,255,0.35)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="growth" fill="#ff3b00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Posts published per week">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={charts.postsPublished}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.35)" />
            <YAxis stroke="rgba(255,255,255,0.35)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="posts" fill="#ffffff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Reach trend">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={charts.reachTrend}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
            <YAxis stroke="rgba(255,255,255,0.35)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="#ff3b00"
              fill="rgba(255,59,0,0.18)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2 text-white/80">
        <Target className="h-4 w-4 text-forge-red" />
        <h3 className="text-sm font-medium tracking-[0.08em]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

const tooltipStyle = {
  backgroundColor: "#111111",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  color: "#ffffff",
};
