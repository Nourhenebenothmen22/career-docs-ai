import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon, AcademicCapIcon, ArrowDownTrayIcon, TrashIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { historyApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/preview/EmptyState';
import useAppStore from '../store/useAppStore';

export default function History() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const addToast = useAppStore(s => s.addToast);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyApi.getAll(page);
      setDocuments(res.documents || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('history.deleteConfirm'))) return;
    try {
      await historyApi.delete(id);
      addToast('Document deleted', 'success');
      fetchDocs();
    } catch {
      addToast('Failed to delete document', 'error');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await historyApi.downloadPdf(id);
      addToast('PDF downloaded', 'success');
    } catch {
      addToast('PDF download failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('history.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} {total === 1 ? t('history.subtitle_one') : t('history.subtitle')}
        </p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title={t('history.noDocuments')}
          description={t('history.noDocumentsDesc')}
          actionLabel={t('history.createOne')}
          actionTo="/dashboard"
        />
      ) : (
        <>
          <div className="space-y-3">
            {documents.map(doc => (
              <Card key={doc.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    doc.type === 'motivation' ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {doc.type === 'motivation' ? <DocumentTextIcon className="h-6 w-6" /> : <AcademicCapIcon className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {doc.type === 'motivation' ? t('nav.motivationLetter') : t('nav.recommendationLetter')}
                    </p>
                    <p className="text-sm text-gray-500">{doc.summary}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(doc.id)} title={t('history.downloadPdf')}>
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-red-500 hover:bg-red-50" title={t('history.delete')}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeftIcon className="h-4 w-4" />
                {t('history.previous')}
              </Button>
              <span className="text-sm text-gray-500">{t('history.page')} {page} / {totalPages}</span>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                {t('history.next')}
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
