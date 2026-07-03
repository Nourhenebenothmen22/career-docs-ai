export default function FormCard({ title, description, children }) {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
