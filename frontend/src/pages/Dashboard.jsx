import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon, AcademicCapIcon, ArrowRightIcon,
  ClockIcon, DocumentIcon,
} from '@heroicons/react/24/outline';
import { historyApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import useAppStore from '../store/useAppStore';

const quickActions = (t) => [
  {
    to: '/motivation-letter',
    icon: DocumentTextIcon,
    title: t('nav.motivationLetter'),
    description: t('dashboard.createMotivation'),
    color: 'bg-primary-600',
  },
  {
    to: '/recommendation-letter',
    icon: AcademicCapIcon,
    title: t('nav.recommendationLetter'),
    description: t('dashboard.createRecommendation'),
    color: 'bg-emerald-600',
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = useAppStore(s => s.stats);
  const setStats = useAppStore(s => s.setStats);

  useEffect(() => {
    historyApi.getAll(1, 5)
      .then(res => {
        setRecentDocs(res.documents || []);
        setStats({
          total: res.total || 0,
          motivation: (res.documents || []).filter(d => d.type === 'motivation').length,
          recommendation: (res.documents || []).filter(d => d.type === 'recommendation').length,
        });
      })
      .catch(() => setRecentDocs([]))
      .finally(() => setLoading(false));
  }, [setStats]);

  const statCards = [
    { label: t('dashboard.totalLetters'), value: stats.total, icon: DocumentIcon, color: 'text-primary-600 bg-primary-50' },
    { label: t('dashboard.motivationLetters'), value: stats.motivation, icon: DocumentTextIcon, color: 'text-emerald-600 bg-emerald-50' },
    { label: t('dashboard.recommendationLetters'), value: stats.recommendation, icon: AcademicCapIcon, color: 'text-violet-600 bg-violet-50' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {statCards.map(s => (
          <Card key={s.label} className="!p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('dashboard.quickActions')}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {quickActions(t).map(action => (
            <Link key={action.to} to={action.to} className="group">
              <Card className="flex items-start gap-4 transition-all hover:border-primary-200 hover:shadow-md">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 flex-shrink-0 self-center text-gray-300 transition-colors group-hover:text-primary-500" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentDocuments')}</h2>
          <Link to="/history" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            {t('dashboard.viewAll')}
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={3} />
        ) : recentDocs.length === 0 ? (
          <Card className="flex flex-col items-center py-12 text-center">
            <ClockIcon className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="font-semibold text-gray-400">{t('dashboard.noDocuments')}</h3>
            <p className="mt-1 text-sm text-gray-400">{t('dashboard.noDocumentsDesc')}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentDocs.map(doc => (
              <Link key={doc.id} to="/history" className="group block">
                <Card className="flex items-center justify-between transition-all hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      doc.type === 'motivation' ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {doc.type === 'motivation' ? <DocumentTextIcon className="h-5 w-5" /> : <AcademicCapIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{doc.type === 'motivation' ? t('nav.motivationLetter') : t('nav.recommendationLetter')}</p>
                      <p className="text-sm text-gray-500">{doc.summary}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
