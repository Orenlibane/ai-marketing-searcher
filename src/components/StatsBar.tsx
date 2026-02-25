import { MarketingTool } from "@prisma/client";

export default function StatsBar({ tools }: { tools: MarketingTool[] }) {
  const total = tools.length;
  const newLaunches = tools.filter((t) => t.isNewLaunch).length;
  const categories = new Set(tools.map((t) => t.category)).size;
  const avgScore = total > 0 ? Math.round(tools.reduce((s, t) => s + t.usageScore, 0) / total) : 0;

  const stats = [
    { label: "Total Tools", value: total, icon: "🛠️" },
    { label: "New Launches", value: newLaunches, icon: "🚀" },
    { label: "Categories", value: categories, icon: "📂" },
    { label: "Avg Score", value: avgScore, icon: "⭐" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-1"
        >
          <span className="text-2xl">{stat.icon}</span>
          <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          <span className="text-xs text-gray-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
