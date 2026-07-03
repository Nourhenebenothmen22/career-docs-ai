import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="card flex flex-col items-center py-16 text-center">
      <DocumentTextIcon className="mb-4 h-16 w-16 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
