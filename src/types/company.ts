export interface CompanyReview {
  n: string;
  av: string;
  r: number;
  d: string;
  t: string;
}

export interface Company {
  id: string;
  name: string;
  cat: string;
  color: string;
  bg: string;
  initials: string;
  desc: string;
  tags: string[];
  rating: number;
  reviews: number;
  price: string;
  verified: boolean;
  featured: boolean;
  isNew: boolean;
  location: string;
  founded: string;
  team: string;
  website: string;
  services: string[];
  revs: CompanyReview[];
}

export type SortOption = "rating" | "reviews" | "price" | "name";

export interface CompanyFilters {
  categories: string[];
  minRating: number | null;
  budget: string | null;
  verifiedOnly: boolean;
  recommendedOnly: boolean;
  newOnly: boolean;
}

export interface SearchCompaniesRequest {
  query: string;
  category?: string;
}

export interface SearchCompaniesResponse {
  companies: Company[];
  error?: string;
}
