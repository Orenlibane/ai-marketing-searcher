import { MarketingTool } from "@prisma/client";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-800 border border-green-200"
      : score >= 60
        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
        : "bg-red-100 text-red-800 border border-red-200";

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}

function SentimentDot({ sentiment }: { sentiment: string }) {
  const color =
    sentiment === "positive"
      ? "bg-green-500"
      : sentiment === "negative"
        ? "bg-red-500"
        : "bg-yellow-500";

  const label =
    sentiment === "positive" ? "Positive" : sentiment === "negative" ? "Negative" : "Neutral";

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export default function ToolCard({ tool }: { tool: MarketingTool }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
          {tool.isNewLaunch && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              New
            </span>
          )}
        </div>
        <ScoreBadge score={tool.usageScore} />
      </div>

      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{tool.description}</p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <SentimentDot sentiment={tool.reviewSentiment} />
        <a
          href={tool.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          Visit
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
