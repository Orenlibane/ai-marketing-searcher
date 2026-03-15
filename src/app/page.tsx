import { prisma } from "@/lib/prisma";
import StatsBar from "@/components/StatsBar";
import CategorySection from "@/components/CategorySection";
import DashboardShell from "@/components/DashboardShell";

const CATEGORY_ORDER = ["SEO", "Content", "Social", "Analytics", "Email", "Ads", "Video", "Design"];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tools = await prisma.marketingTool.findMany({
    orderBy: { usageScore: "desc" },
  });

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof tools>>((acc, cat) => {
    acc[cat] = tools.filter((t) => t.category === cat);
    return acc;
  }, {});

  return (
    <DashboardShell
      productsContent={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
          {/* Stats */}
          <StatsBar tools={tools} />

          {/* Category Sections */}
          {CATEGORY_ORDER.map((category) =>
            grouped[category]?.length ? (
              <CategorySection
                key={category}
                category={category}
                tools={grouped[category]}
              />
            ) : null
          )}

          {tools.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-medium">No tools yet.</p>
              <p className="text-sm mt-1">
                Click <strong>Sync Now</strong> to fetch tools, or seed the database via{" "}
                <code className="bg-gray-100 px-1 rounded">POST /api/seed</code>.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
