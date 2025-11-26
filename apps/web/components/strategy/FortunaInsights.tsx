'use client';

/**
 * Fortuna Insights Component
 *
 * Displays problem intelligence from Fortuna to inform product strategy.
 * Shows top validated problems, trending topics, and industry breakdown.
 */

import { useState } from 'react';
import {
  FortunaProvider,
  useTopProblems,
  useTrendingTopics,
  useIndustryBreakdown,
  useProblemSearch,
  useNbiDisplay,
  type Problem,
} from '@fortuna/client/react';

// Configuration
const FORTUNA_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_FORTUNA_API_URL || 'https://api.fortuna.tube',
  apiKey: process.env.NEXT_PUBLIC_FORTUNA_API_KEY,
};

// ============================================================================
// Sub-components
// ============================================================================

function NbiBadge({ score }: { score: number }) {
  const { formatted, severity, color } = useNbiDisplay(score);

  const bgColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColors[severity]}`}>
      NBI {formatted}
    </span>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 line-clamp-2">{problem.title}</h4>
        <NbiBadge score={problem.nbiScore} />
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{problem.description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded">{problem.industry}</span>
        <span>•</span>
        <span>{problem.signalCount} signals</span>
        <span>•</span>
        <span className="capitalize">{problem.status}</span>
      </div>
    </div>
  );
}

function TopProblemsSection() {
  const { data: problems, isLoading, error } = useTopProblems(5);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !problems) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
        Unable to load problem insights. Connect to Fortuna API.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}

function TrendingTopicsSection() {
  const { data: topics, isLoading } = useTrendingTopics(7);

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />;
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {topics.slice(0, 5).map(topic => (
        <div key={topic.topic} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm font-medium">{topic.topic}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className={topic.growth > 0 ? 'text-green-600' : 'text-red-600'}>
              {topic.growth > 0 ? '↑' : '↓'} {Math.abs(topic.growth)}%
            </span>
            <span className="text-gray-500">{topic.problems} problems</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function IndustryBreakdownSection() {
  const { data: industries, isLoading } = useIndustryBreakdown();

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded-lg" />;
  }

  if (!industries || industries.length === 0) {
    return null;
  }

  const maxCount = Math.max(...industries.map(i => i.count));

  return (
    <div className="space-y-2">
      {industries.slice(0, 6).map(industry => (
        <div key={industry.industry} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{industry.industry}</span>
            <span className="text-gray-500">
              {industry.count} • Avg NBI {Math.round(industry.avgNbiScore)}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${(industry.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProblemSearch() {
  const { query, setQuery, results, isSearching } = useProblemSearch(300);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search validated problems..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {isSearching && (
        <div className="absolute right-3 top-2.5">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {results.map(problem => (
            <div
              key={problem.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{problem.title}</span>
                <NbiBadge score={problem.nbiScore} />
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{problem.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function FortunaInsightsContent() {
  const [activeTab, setActiveTab] = useState<'problems' | 'trends' | 'industries'>('problems');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Problem Intelligence
            </h3>
            <p className="text-sm text-gray-600">Validated customer problems from Fortuna</p>
          </div>
          <a
            href="https://app.fortuna.tube"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Open Fortuna →
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <ProblemSearch />
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'problems', label: 'Top Problems' },
            { id: 'trends', label: 'Trending' },
            { id: 'industries', label: 'Industries' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'problems' && <TopProblemsSection />}
        {activeTab === 'trends' && <TrendingTopicsSection />}
        {activeTab === 'industries' && <IndustryBreakdownSection />}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Data-driven product decisions powered by Fortuna Problem Intelligence
      </div>
    </div>
  );
}

/**
 * Fortuna Insights Widget
 *
 * Embed this component in admin dashboards or strategy pages
 * to surface validated customer problems for product decisions.
 */
export default function FortunaInsights() {
  return (
    <FortunaProvider config={FORTUNA_CONFIG}>
      <FortunaInsightsContent />
    </FortunaProvider>
  );
}

export { FortunaInsights, NbiBadge, ProblemCard };
