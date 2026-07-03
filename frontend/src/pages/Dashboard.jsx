import { Link } from 'react-router-dom';
import { DocumentTextIcon, AcademicCapIcon, ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { historyApi } from '../services/api';

const quickActions = [
  {
    to: '/motivation-letter',
    icon: DocumentTextIcon,
    title: 'Motivation Letter',
    description: 'Generate a professional cover letter for a job application',
    color: 'bg-primary-500',
  },
  {
    to: '/recommendation-letter',
    icon: AcademicCapIcon,
    title: 'Recommendation Letter',
    description: 'Create a formal recommendation letter for a colleague',
    color: 'bg-emerald-500',
  },
];

export default function Dashboard() {
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyApi.getAll(1, 5)
      .then(res => setRecentDocs(res.documents || []))
      .catch(() => setRecentDocs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Generate and manage your professional HR documents.</p>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {quickActions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="card group flex items-start gap-4 transition-all hover:shadow-md hover:border-primary-200"
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 flex-shrink-0 self-center text-gray-300 group-hover:text-primary-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          <Link to="/history" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="card py-8 text-center text-sm text-gray-400">Loading...</div>
        ) : recentDocs.length === 0 ? (
          <div className="card flex flex-col items-center py-12 text-center">
            <ClockIcon className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="font-semibold text-gray-400">No documents yet</h3>
            <p className="mt-1 text-sm text-gray-400">Generate your first document to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDocs.map(doc => (
              <Link
                key={doc.id}
                to={`/history`}
                className="card flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {doc.type === 'motivation' ? (
                    <DocumentTextIcon className="h-8 w-8 text-primary-500" />
                  ) : (
                    <AcademicCapIcon className="h-8 w-8 text-emerald-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{doc.type} Letter</p>
                    <p className="text-sm text-gray-500">{doc.summary}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
