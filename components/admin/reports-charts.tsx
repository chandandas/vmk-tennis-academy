"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { name: string; count: number };

export function ReportsCharts({
  sourceData,
  stageData,
}: {
  sourceData: Row[];
  stageData: Row[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Leads by source" data={sourceData} />
      <ChartCard title="Leads by stage" data={stageData} />
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: Row[] }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No data yet
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
              <Tooltip />
              <Bar dataKey="count" fill="#0b3d2e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
