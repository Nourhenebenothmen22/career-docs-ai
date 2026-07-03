export default function Card({ title, description, children, className = '', ...props }) {
  return (
    <div className={`rounded-card border bg-white p-6 shadow-card sm:p-8 ${className}`} {...props}>
      {title && (
        <div className="mb-5">
          <h3 className="text-subheading text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-caption text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
