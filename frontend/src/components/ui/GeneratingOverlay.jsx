export default function GeneratingOverlay({ visible, message }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-30" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
