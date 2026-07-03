import { useEffect, useState, useCallback } from 'react';
import {
  DocumentTextIcon, AcademicCapIcon, ArrowDownTrayIcon,
  TrashIcon, ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { historyApi } from '../services/api';
import EmptyState from '../components/EmptyState';

export default function History() {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm('Delete this document?')) return;
    try {
      await historyApi.delete(id);
      fetchDocs();
    } catch (e) {
      alert('Failed to delete document');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await historyApi.downloadPdf(id);
    } catch {
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card py-16 text-center text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Document History</h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} {total === 1 ? 'document' : 'documents'} generated
        </p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Generate your first motivation or recommendation letter to see it here."
          actionLabel="Create a Document"
          actionTo="/dashboard"
        />
      ) : (
        <>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {doc.type === 'motivation' ? (
                    <DocumentTextIcon className="h-10 w-10 text-primary-500" />
                  ) : (
                    <AcademicCapIcon className="h-10 w-10 text-emerald-500" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{doc.type} Letter</p>
                    <p className="text-sm text-gray-500">{doc.summary}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(doc.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPdf(doc.id)}
                    className="btn-secondary !px-3 !py-2"
                    title="Download PDF"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn-secondary !px-3 !py-2 text-red-500 hover:bg-red-50 hover:border-red-200"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !px-4 !py-2"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary !px-4 !py-2"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
