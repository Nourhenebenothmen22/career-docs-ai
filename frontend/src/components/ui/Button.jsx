import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-button hover:shadow-button-hover active:bg-primary-800',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-primary-500 shadow-button active:bg-gray-100',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400 active:bg-gray-200',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-button active:bg-red-800',
};

const sizes = {
  sm: 'px-3 py-1.5 text-small gap-1.5',
  md: 'px-4 py-2 text-caption gap-2',
  lg: 'px-6 py-3 text-body gap-2',
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center rounded-button font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading ? (
      <Spinner />
    ) : icon ? (
      <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">{icon}</span>
    ) : null}
    {children}
  </button>
));

Button.displayName = 'Button';
export default Button;
