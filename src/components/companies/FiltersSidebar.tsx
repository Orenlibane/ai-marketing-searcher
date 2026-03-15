import { CompanyFilters } from "@/types/company";

interface FiltersSidebarProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
}

const CATEGORIES = [
  { label: "Video", icon: "🎬" },
  { label: "SEO", icon: "🔍" },
  { label: "Branding", icon: "🏷️" },
  { label: "Content", icon: "✍️" },
  { label: "Social", icon: "📱" },
  { label: "Analytics", icon: "📊" },
  { label: "Email", icon: "📧" },
  { label: "Ads", icon: "📣" },
  { label: "Design", icon: "🎨" },
];

const RATING_OPTIONS = [3, 4, 4.5];
const BUDGET_OPTIONS = ["₪", "₪₪", "₪₪₪"];

export default function FiltersSidebar({
  filters,
  onFiltersChange,
}: FiltersSidebarProps) {
  function toggleCategory(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: next });
  }

  function setMinRating(val: number) {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === val ? null : val,
    });
  }

  function setBudget(val: string) {
    onFiltersChange({
      ...filters,
      budget: filters.budget === val ? null : val,
    });
  }

  function resetFilters() {
    onFiltersChange({
      categories: [],
      minRating: null,
      budget: null,
      verifiedOnly: false,
      recommendedOnly: false,
      newOnly: false,
    });
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minRating !== null ||
    filters.budget !== null ||
    filters.verifiedOnly ||
    filters.recommendedOnly ||
    filters.newOnly;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Filters</h3>

        {/* Categories */}
        <div className="mb-5">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Categories
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => toggleCategory(label)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors duration-150 ${
                  filters.categories.includes(label)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Min Rating */}
        <div className="mb-5">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Minimum Rating
          </h4>
          <div className="flex gap-2">
            {RATING_OPTIONS.map((val) => (
              <button
                key={val}
                onClick={() => setMinRating(val)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150 ${
                  filters.minRating === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {val}+
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-5">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Budget
          </h4>
          <div className="flex gap-2">
            {BUDGET_OPTIONS.map((val) => (
              <button
                key={val}
                onClick={() => setBudget(val)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150 ${
                  filters.budget === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mb-5 space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) =>
                onFiltersChange({ ...filters, verifiedOnly: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Verified only
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.recommendedOnly}
              onChange={(e) =>
                onFiltersChange({ ...filters, recommendedOnly: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Recommended
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.newOnly}
              onChange={(e) =>
                onFiltersChange({ ...filters, newOnly: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            New
          </label>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full text-xs text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-150"
          >
            Reset Filters
          </button>
        )}
      </div>
    </aside>
  );
}
