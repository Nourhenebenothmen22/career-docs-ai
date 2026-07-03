import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownTrayIcon, PrinterIcon, ClipboardIcon,
  ArrowPathIcon, XMarkIcon, DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function PreviewModal({
  open,
  onClose,
  htmlContent,
  letterText,
  language,
  type,
  downloadPdf,
  onGenerateAgain,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const handleDownload = useCallback(async () => {
    if (!downloadPdf) return;
    try { await downloadPdf(); } catch { /* handled in caller */ }
  }, [downloadPdf]);

  const handlePrint = useCallback(() => {
    const iframe = document.getElementById('modal-preview-iframe');
    if (iframe?.contentWindow) iframe.contentWindow.print();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!letterText) return;
    try { await navigator.clipboard.writeText(letterText); } catch { /* fallback */ }
  }, [letterText]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const docLabel = type === 'motivation' ? t('preview.motivationLabel') : t('preview.recommendationLabel');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t('preview.documentPreview')}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} aria-hidden="true" />

      <div className="relative mx-auto flex h-[90vh] w-[92vw] max-w-[1200px] flex-col overflow-hidden rounded-modal bg-white shadow-modal animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-primary-100">
              <DocumentTextIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-subheading text-gray-900 truncate">{t('preview.documentPreview')}</h2>
              <p className="text-small text-gray-400 truncate">
                {docLabel}{language ? ` · ${language}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={t('preview.closeModal')}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* A4 Paper Preview */}
        <div className="flex flex-1 items-start justify-center overflow-y-auto bg-gray-100 px-4 py-8 scrollbar-thin">
          <div
            className="w-full max-w-[210mm] overflow-hidden rounded-lg bg-white shadow-xl"
            style={{ aspectRatio: '210 / 297' }}
          >
            {htmlContent ? (
              <iframe
                id="modal-preview-iframe"
                srcDoc={htmlContent}
                title={t('preview.documentPreview')}
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <DocumentTextIcon className="mx-auto h-12 w-12" aria-hidden="true" />
                  <p className="mt-3 text-caption">{t('preview.noPreview')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex flex-wrap items-center gap-3 border-t bg-white px-6 py-4 ${isRtl ? 'justify-start' : 'justify-center'} sm:justify-between`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-button bg-primary-600 px-5 py-2.5 text-caption font-semibold text-white shadow-button transition-all hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
              {t('preview.downloadPdf')}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-button border border-gray-300 bg-white px-4 py-2.5 text-caption font-medium text-gray-700 shadow-button transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              <PrinterIcon className="h-4 w-4" aria-hidden="true" />
              {t('preview.print')}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-button border border-gray-300 bg-white px-4 py-2.5 text-caption font-medium text-gray-700 shadow-button transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              <ClipboardIcon className="h-4 w-4" aria-hidden="true" />
              {t('preview.copyText')}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onGenerateAgain}
              className="inline-flex items-center gap-2 rounded-button border border-gray-300 bg-white px-4 py-2.5 text-caption font-medium text-gray-700 shadow-button transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
              {t('preview.generateAgain')}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-button px-4 py-2.5 text-caption font-medium text-gray-500 transition-all hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              {t('preview.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
