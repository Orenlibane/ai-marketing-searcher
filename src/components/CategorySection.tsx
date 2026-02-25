import { MarketingTool } from "@prisma/client";
import ToolCard from "./ToolCard";

const CATEGORY_ICONS: Record<string, string> = {
  SEO: "🔍",
  Content: "✍️",
  Social: "📱",
  Analytics: "📊",
  Email: "📧",
  Ads: "📣",
  Video: "🎬",
  Design: "🎨",
};

export default function CategorySection({
  category,
  tools,
}: {
  category: string;
  tools: MarketingTool[];
}) {
  const sorted = [...tools].sort((a, b) => b.usageScore - a.usageScore);
  const icon = CATEGORY_ICONS[category] ?? "🛠️";

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-bold text-gray-800">{category}</h2>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
          {tools.length} tools
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sorted.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
