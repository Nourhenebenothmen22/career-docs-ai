import { Link } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <Card className="flex flex-col items-center py-16 text-center">
      <DocumentTextIcon className="mb-4 h-16 w-16 text-gray-300" />
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </Card>
  );
}
