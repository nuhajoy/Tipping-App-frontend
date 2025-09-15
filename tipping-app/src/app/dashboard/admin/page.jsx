"use client";

import { useAdminStore } from "@/store/adminStore";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

const StatCard = ({ title, value }) => (
  <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300">
    <h4 className="text-sm text-muted-foreground mb-2">{title}</h4>
    <p className="text-xl font-bold">{value}</p>
  </Card>
);
const useAdminAnalytics = () => {
  const { providers, loadProviders } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        await loadProviders();
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [loadProviders]);
  const mockAnalytics = {
    totalTips: 16500,
    withdrawn: 4500,
    platformRevenue: 12000,
    activeProviders: providers.length,
    totalEmployees: 12,
  };

  const mockChartData = [
    { label: "Week 1", value: 2000 },
    { label: "Week 2", value: 4000 },
    { label: "Week 3", value: 7000 },
    { label: "Week 4", value: 10000 },
    { label: "Week 5", value: 13000 },
    { label: "Week 6", value: 16500 },
  ];

  return {
    analytics: mockAnalytics,
    chartData: mockChartData,
    loading,
    error,
  };
};

export default function AdminDashboard() {
  const { analytics, chartData, loading, error } = useAdminAnalytics();
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const svgMetrics = {
    width: 720,
    height: 220,
    padding: { left: 48, right: 16, top: 16, bottom: 28 },
  };

  const { width, height, padding } = svgMetrics;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxMoney = Math.max(...chartData.map((d) => d.value));
  const getX = (i) => padding.left + (i / (chartData.length - 1)) * innerWidth;
  const getY = (val) => padding.top + (1 - val / maxMoney) * innerHeight;
  const points = chartData.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [points]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  const transactionData = {
    "Recent Transaction": "500 ETB",
    "Total Transactions": `${analytics.totalTips} ETB`,
    "Platform Revenue": `${analytics.platformRevenue} ETB`,
    "Withdrawn Money": `${analytics.withdrawn} ETB`,
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-2">
        {Object.entries(transactionData).map(([title, value]) => (
          <StatCard key={title} title={title} value={value} />
        ))}
      </div>

      <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold mb-4">Platform Growth (ETB)</h3>
        <div className="relative w-full overflow-hidden">
          {hoveredPoint && (
            <div
              className="absolute z-10 bg-card border border-border rounded-lg shadow px-2 py-1 text-xs pointer-events-none"
              style={{
                left: Math.min(Math.max(hoveredPoint.x - 40, 8), width - 90),
                top: Math.max(hoveredPoint.y - 36, 8),
              }}
            >
              <div className="font-semibold">{hoveredPoint.label}</div>
              <div className="text-muted-foreground">{hoveredPoint.value.toLocaleString()} ETB</div>
            </div>
          )}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="var(--border)"
              strokeWidth="1"
            />
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const gy = padding.top + (1 - t) * innerHeight;
              return (
                <line
                  key={`grid-line-${i}`}
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={gy}
                  y2={gy}
                  stroke="var(--input)"
                  strokeWidth="1"
                />
              );
            })}
            
            <polyline
              ref={pathRef}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="3"
              points={points}
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                animation: "dash-anim 1.2s ease forwards",
              }}
            />
            <style>{`@keyframes dash-anim { to { stroke-dashoffset: 0; } }`}</style>

            {chartData.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.value);
              return (
                <g key={`data-point-${i}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="var(--accent)"
                    className="transition-colors duration-150"
                    onMouseEnter={() =>
                      setHoveredPoint({ i, x: cx, y: cy, value: d.value, label: d.label })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="transparent"
                    onMouseEnter={() =>
                      setHoveredPoint({ i, x: cx, y: cy, value: d.value, label: d.label })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
            
            {chartData.map((d, i) => (
              <text
                key={`x-label-${i}`}
                x={getX(i)}
                y={height - padding.bottom + 18}
                fontSize="12"
                textAnchor="middle"
                fill="var(--muted-foreground)"
              >
                {d.label}
              </text>
            ))}
           
            {[0, 5000, 10000, 15000, maxMoney].map((val, i) => (
              <text
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={getY(val)}
                fontSize="12"
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--muted-foreground)"
              >
                {val}
              </text>
            ))}
          </svg>
        </div>
      </Card>
    </>
  );
}