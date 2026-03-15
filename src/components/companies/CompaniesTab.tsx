"use client";

import { useState, useEffect, useCallback } from "react";
import { Company, CompanyFilters, SortOption } from "@/types/company";
import SearchBar from "./SearchBar";
import FiltersSidebar from "./FiltersSidebar";
import ResultsHeader from "./ResultsHeader";
import ResultsSkeleton from "./ResultsSkeleton";
import CompanyCard from "./CompanyCard";
import CompanyProfileModal from "./CompanyProfileModal";

const INITIAL_FILTERS: CompanyFilters = {
  categories: [],
  minRating: null,
  budget: null,
  verifiedOnly: false,
  recommendedOnly: false,
  newOnly: false,
};

function applyFilters(companies: Company[], filters: CompanyFilters): Company[] {
  return companies.filter((c) => {
    if (filters.categories.length > 0 && !filters.categories.includes(c.cat)) {
      return false;
    }
    if (filters.minRating !== null && c.rating < filters.minRating) {
      return false;
    }
    if (filters.budget !== null && c.price !== filters.budget) {
      return false;
    }
    if (filters.verifiedOnly && !c.verified) {
      return false;
    }
    if (filters.recommendedOnly && !c.featured) {
      return false;
    }
    if (filters.newOnly && !c.isNew) {
      return false;
    }
    return true;
  });
}

function applySorting(companies: Company[], sortBy: SortOption): Company[] {
  const sorted = [...companies];
  switch (sortBy) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews":
      sorted.sort((a, b) => b.reviews - a.reviews);
      break;
    case "price": {
      const priceOrder: Record<string, number> = { "₪": 1, "₪₪": 2, "₪₪₪": 3 };
      sorted.sort((a, b) => (priceOrder[a.price] ?? 2) - (priceOrder[b.price] ?? 2));
      break;
    }
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sorted;
}

export default function CompaniesTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [filters, setFilters] = useState<CompanyFilters>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hasSearched, setHasSearched] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("company-favorites");
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((next: Set<string>) => {
    setFavorites(next);
    localStorage.setItem("company-favorites", JSON.stringify([...next]));
  }, []);

  function toggleFavorite(id: string) {
    const next = new Set(favorites);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    saveFavorites(next);
  }

  async function handleSearch() {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed. Please try again.");
        return;
      }

      if (data.companies && Array.isArray(data.companies)) {
        setResults(data.companies);
      } else {
        setError("Unexpected response format.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = applySorting(applyFilters(results, filters), sortBy);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-6 mt-6">
        {/* Sidebar - only show after first search */}
        {hasSearched && (
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
        )}

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <ResultsSkeleton />
          ) : hasSearched ? (
            <>
              {results.length > 0 && (
                <ResultsHeader
                  count={filtered.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              )}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      isFavorite={favorites.has(company.id)}
                      onToggleFavorite={toggleFavorite}
                      onViewProfile={() => setSelectedCompany(company)}
                    />
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="font-medium">No results match your filters</p>
                  <p className="text-sm mt-1">Try adjusting your filter criteria.</p>
                </div>
              ) : !error ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="font-medium">No companies found</p>
                  <p className="text-sm mt-1">Try a different search query.</p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏢</p>
              <p className="font-medium text-gray-600 text-lg">
                Find Marketing Agencies
              </p>
              <p className="text-sm mt-2 max-w-md mx-auto">
                Search for marketing agencies and service providers. Enter a query
                above to discover companies matching your needs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedCompany && (
        <CompanyProfileModal
          company={selectedCompany}
          allCompanies={results}
          isFavorite={favorites.has(selectedCompany.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedCompany(null)}
          onViewProfile={(company) => setSelectedCompany(company)}
        />
      )}
    </div>
  );
}
