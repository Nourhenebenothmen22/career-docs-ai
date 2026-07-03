import { forwardRef, useId } from 'react';

const Input = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-caption font-medium text-gray-700">
          {label}
          {props.required && <span className="ms-1 text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`block w-full rounded-button border bg-white px-4 py-2.5 text-caption text-gray-900 placeholder-gray-400 shadow-button transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${error ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30' : 'border-gray-300 focus-visible:border-primary-500 focus-visible:ring-primary-500/30'} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-small text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export function Select({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-caption font-medium text-gray-700">
          {label}
          {props.required && <span className="ms-1 text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        className={`block w-full rounded-button border bg-white px-4 py-2.5 text-caption text-gray-900 shadow-button transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${error ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30' : 'border-gray-300 focus-visible:border-primary-500 focus-visible:ring-primary-500/30'} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-small text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
}
