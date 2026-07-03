import { useTranslation } from 'react-i18next';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

export default function PreviewPanel({ htmlContent, letterText, type }) {
  const { t } = useTranslation();

  if (!htmlContent && !letterText) {
    return (
      <Card className="flex flex-col items-center py-16 text-center">
        <DocumentTextIcon className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="text-base font-semibold text-gray-400">
          {type === 'recommendation' ? t('recommendation.noDocument') : t('motivation.noDocument')}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          {type === 'recommendation' ? t('recommendation.noDocumentDesc') : t('motivation.noDocumentDesc')}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-inner">
        <iframe
          srcDoc={htmlContent}
          title="Document Preview"
          className="h-[650px] w-full"
          style={{ border: 'none' }}
        />
      </div>
    </Card>
  );
}
