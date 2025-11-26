'use client';

/**
 * Coforma Feedback Widget
 *
 * Embeddable feedback widget for MADFAM products to collect
 * customer advisory board feedback directly from the product interface.
 */

import { useState } from 'react';
import {
  CoformaProvider,
  useProductFeedback,
  useSubmitFeedback,
  useRoadmap,
  useMemberProfile,
  getFeedbackStatusColor,
  getFeedbackTypeIcon,
  type FeedbackType,
  type CoformaConfig,
} from '@coforma/client/react';

// ============================================================================
// Configuration
// ============================================================================

const coformaConfig: CoformaConfig = {
  baseUrl: process.env.NEXT_PUBLIC_COFORMA_API_URL || 'https://api.coforma.studio',
  apiKey: process.env.NEXT_PUBLIC_COFORMA_API_KEY || '',
  tenantId: process.env.NEXT_PUBLIC_COFORMA_TENANT_ID || 'madfam',
  productId: process.env.NEXT_PUBLIC_COFORMA_PRODUCT_ID || 'madfam-site',
};

// ============================================================================
// Feedback Form
// ============================================================================

interface FeedbackFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

function FeedbackForm({ onSubmit, onCancel }: FeedbackFormProps) {
  const { submit, submitting, error } = useSubmitFeedback();
  const [type, setType] = useState<FeedbackType>('IDEA');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit({
        type,
        title,
        description,
        context: {
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
        },
      });
      onSubmit();
    } catch {
      // Error is handled by the hook
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string; icon: string }[] = [
    { value: 'IDEA', label: 'Idea', icon: '💡' },
    { value: 'REQUEST', label: 'Feature Request', icon: '✨' },
    { value: 'BUG', label: 'Bug Report', icon: '🐛' },
    { value: 'RESEARCH_INSIGHT', label: 'Research Insight', icon: '🔍' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <div className="flex flex-wrap gap-2">
          {feedbackTypes.map(ft => (
            <button
              key={ft.value}
              type="button"
              onClick={() => setType(ft.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                type === ft.value
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {ft.icon} {ft.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Brief summary of your feedback"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Provide details about your feedback..."
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error.message}</div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !title || !description}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Feedback Summary
// ============================================================================

function FeedbackSummary() {
  const { summary, loading, error } = useProductFeedback();

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (error || !summary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{summary.totalFeedback}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.openItems}</div>
          <div className="text-xs text-gray-500">Open</div>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{summary.plannedItems}</div>
          <div className="text-xs text-gray-500">Planned</div>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.shippedItems}</div>
          <div className="text-xs text-gray-500">Shipped</div>
        </div>
      </div>

      {summary.topRequests.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Requests</h4>
          <div className="space-y-2">
            {summary.topRequests.slice(0, 3).map(request => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700 truncate flex-1">{request.title}</span>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs text-gray-500">👍 {request.votes}</span>
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      backgroundColor: `${getFeedbackStatusColor(request.status)}20`,
                      color: getFeedbackStatusColor(request.status),
                    }}
                  >
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Roadmap Preview
// ============================================================================

function RoadmapPreview() {
  const { roadmap, loading, error } = useRoadmap({ publicOnly: true });

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  if (error || roadmap.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No public roadmap items available</p>
    );
  }

  const statusConfig = {
    BACKLOG: { color: '#6B7280', label: 'Backlog' },
    PLANNED: { color: '#3B82F6', label: 'Planned' },
    IN_PROGRESS: { color: '#8B5CF6', label: 'In Progress' },
    SHIPPED: { color: '#10B981', label: 'Shipped' },
  };

  return (
    <div className="space-y-3">
      {roadmap.slice(0, 5).map(item => (
        <div
          key={item.id}
          className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <span
              className="px-2 py-0.5 text-xs rounded-full whitespace-nowrap"
              style={{
                backgroundColor: `${statusConfig[item.status].color}20`,
                color: statusConfig[item.status].color,
              }}
            >
              {statusConfig[item.status].label}
            </span>
          </div>
          {item.quarter && <div className="mt-2 text-xs text-gray-400">📅 {item.quarter}</div>}
          {item.cabInfluenceScore > 0 && (
            <div className="mt-1 text-xs text-indigo-500">
              🎯 CAB Influenced ({item.cabInfluenceScore}%)
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CAB Member Badge
// ============================================================================

function CABMemberBadge() {
  const { member, isCABMember } = useMemberProfile();

  if (!isCABMember || !member) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
      <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-sm">
        🏅
      </div>
      <div>
        <div className="text-sm font-medium text-indigo-900">CAB Member</div>
        <div className="text-xs text-indigo-600">
          {member.badges.length > 0 && member.badges[0].name}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Widget
// ============================================================================

type WidgetTab = 'feedback' | 'roadmap' | 'submit';

function FeedbackWidgetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('feedback');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('feedback');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 flex items-center justify-center z-50"
        aria-label="Open feedback widget"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">Feedback & Roadmap</span>
          <span className="px-2 py-0.5 bg-white/20 rounded text-xs text-white">
            Powered by Coforma
          </span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'feedback'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Feedback
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'roadmap'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🗺️ Roadmap
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'submit'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ✏️ Submit
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900">Thank you!</h3>
            <p className="text-sm text-gray-500">Your feedback has been submitted.</p>
          </div>
        ) : (
          <>
            {activeTab === 'feedback' && (
              <div className="space-y-4">
                <CABMemberBadge />
                <FeedbackSummary />
              </div>
            )}
            {activeTab === 'roadmap' && <RoadmapPreview />}
            {activeTab === 'submit' && (
              <FeedbackForm
                onSubmit={handleSubmitSuccess}
                onCancel={() => setActiveTab('feedback')}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <a
          href="https://coforma.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Coforma Studio - Customer Advisory Board Platform
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// Export with Provider
// ============================================================================

export default function FeedbackWidget() {
  if (!coformaConfig.apiKey) {
    // Don't render if not configured
    return null;
  }

  return (
    <CoformaProvider config={coformaConfig}>
      <FeedbackWidgetContent />
    </CoformaProvider>
  );
}

// Also export individual components for custom implementations
export { FeedbackForm, FeedbackSummary, RoadmapPreview, CABMemberBadge };
