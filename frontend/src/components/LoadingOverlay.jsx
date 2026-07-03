export default function LoadingOverlay({ visible, message }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="card flex flex-col items-center gap-4 px-10 py-8">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-40" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
        <p className="text-sm font-medium text-gray-600">{message || 'Generating your document...'}</p>
      </div>
    </div>
  );
}
