export default function Card({ title, description, children, className = '', ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`} {...props}>
      {title && (
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
