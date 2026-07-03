import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>
    )}
    <input
      ref={ref}
      className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;

export function Select({ label, error, options, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
