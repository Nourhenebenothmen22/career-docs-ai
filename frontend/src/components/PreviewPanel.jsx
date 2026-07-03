import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PreviewPanel({ htmlContent, letterText, type }) {
  if (!htmlContent && !letterText) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <DocumentTextIcon className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-400">No document yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Fill in the form and click Generate to preview your {type === 'recommendation' ? 'recommendation' : 'motivation'} letter
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-inner">
        <iframe
          srcDoc={htmlContent}
          title="Document Preview"
          className="h-[600px] w-full"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
