"use client";

import { useState, useEffect } from "react";
import { Company } from "@/types/company";

interface CompanyProfileModalProps {
  company: Company;
  allCompanies: Company[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onViewProfile: (company: Company) => void;
}

type ProfileTab = "overview" | "reviews" | "contact" | "similar";

export default function CompanyProfileModal({
  company,
  allCompanies,
  isFavorite,
  onToggleFavorite,
  onClose,
  onViewProfile,
}: CompanyProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setActiveTab("overview");
  }, [company.id]);

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "reviews", label: "Reviews" },
    { key: "contact", label: "Contact" },
    { key: "similar", label: "Similar" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ backgroundColor: company.bg, color: company.color }}
              >
                {company.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                  {company.verified && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                      Verified
                    </span>
                  )}
                  {company.featured && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                      Featured
                    </span>
                  )}
                  {company.isNew && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{company.cat} · {company.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleFavorite(company.id)}
                className={`p-2 rounded-lg border transition-colors duration-150 ${
                  isFavorite
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-gray-400 hover:text-red-500"
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  activeTab === tab.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && <OverviewTab company={company} />}
          {activeTab === "reviews" && <ReviewsTab company={company} />}
          {activeTab === "contact" && <ContactTab company={company} />}
          {activeTab === "similar" && (
            <SimilarTab
              company={company}
              allCompanies={allCompanies}
              onViewProfile={onViewProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Overview Tab ─────────────────────────────────────── */

function OverviewTab({ company }: { company: Company }) {
  const details = [
    { label: "Location", value: company.location },
    { label: "Founded", value: company.founded },
    { label: "Team Size", value: company.team },
    { label: "Budget", value: company.price },
    { label: "Website", value: company.website, isLink: true },
  ];

  return (
    <div className="space-y-6">
      {/* Details Table */}
      <div className="grid grid-cols-2 gap-3">
        {details.map((d) => (
          <div key={d.label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{d.label}</p>
            {d.isLink ? (
              <a
                href={d.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {d.value}
              </a>
            ) : (
              <p className="text-sm font-medium text-gray-900">{d.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{company.desc}</p>
      </div>

      {/* Services */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Services</h4>
        <div className="space-y-1.5">
          {company.services.map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Tags / Expertise */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Reviews Tab ──────────────────────────────────────── */

function ReviewsTab({ company }: { company: Company }) {
  const [showForm, setShowForm] = useState(false);
  const revs = company.revs || [];

  // Compute star distribution from reviews
  const distribution = [0, 0, 0, 0, 0]; // index 0 = 1-star ... index 4 = 5-star
  revs.forEach((r) => {
    const idx = Math.min(4, Math.max(0, Math.round(r.r) - 1));
    distribution[idx]++;
  });
  const maxCount = Math.max(1, ...distribution);

  return (
    <div className="space-y-6">
      {/* Average Score */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{company.rating}</p>
          <p className="text-xs text-gray-500 mt-1">{company.reviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3">{star}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(distribution[star - 1] / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Quality", value: Math.min(5, company.rating + 0.1) },
          { label: "Communication", value: Math.min(5, company.rating - 0.1) },
          { label: "Timeliness", value: Math.min(5, company.rating + 0.2) },
          { label: "Value", value: Math.min(5, company.rating - 0.2) },
        ].map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{metric.label}</span>
              <span className="font-medium text-gray-900">{metric.value.toFixed(1)}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${(metric.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {revs.map((rev, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: rev.av }}
              >
                {rev.n.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{rev.n}</p>
                <p className="text-[10px] text-gray-400">{rev.d}</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <svg
                    key={j}
                    className={`w-3 h-3 ${j < rev.r ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{rev.t}</p>
          </div>
        ))}
      </div>

      {/* Write Review */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
        >
          Write a Review
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Write a Review</h4>
          <div>
            <label className="text-xs text-gray-500">Rating</label>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Your Review</label>
            <textarea
              rows={3}
              placeholder="Share your experience..."
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Contact Tab ──────────────────────────────────────── */

function ContactTab({ company }: { company: Company }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Get in touch with <span className="font-semibold">{company.name}</span>
      </p>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Your Name</label>
          <input
            type="text"
            placeholder="Full name"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Subject</label>
          <input
            type="text"
            defaultValue={`Inquiry about ${company.name} services`}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Services of Interest</label>
          <select
            defaultValue=""
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>
              Select a service
            </option>
            {company.services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Message</label>
          <textarea
            rows={4}
            placeholder="Tell them about your project..."
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-150">
          Send Message
        </button>
      </div>
    </div>
  );
}

/* ── Similar Tab ──────────────────────────────────────── */

function SimilarTab({
  company,
  allCompanies,
  onViewProfile,
}: {
  company: Company;
  allCompanies: Company[];
  onViewProfile: (company: Company) => void;
}) {
  const similar = allCompanies.filter(
    (c) => c.id !== company.id && c.cat === company.cat
  );

  if (similar.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        No similar companies found in this category.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Other companies in <span className="font-semibold">{company.cat}</span>
      </p>
      {similar.map((c) => (
        <button
          key={c.id}
          onClick={() => onViewProfile(c)}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: c.bg, color: c.color }}
          >
            {c.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
            <p className="text-xs text-gray-500">{c.cat} · {c.rating} stars · {c.reviews} reviews</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );
}
