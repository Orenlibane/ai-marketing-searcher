import { SortOption } from "@/types/company";

interface ResultsHeaderProps {
  count: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function ResultsHeader({
  count,
  sortBy,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{count}</span> result
        {count !== 1 ? "s" : ""} found
      </p>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="rating">Highest Rated</option>
        <option value="reviews">Most Reviews</option>
        <option value="price">Lowest Price</option>
        <option value="name">A-Z</option>
      </select>
    </div>
  );
}
