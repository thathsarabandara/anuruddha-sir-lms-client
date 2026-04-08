import React from 'react';

/**
 * ButtonWithLoader Component
 * 
 * Displays a button with loading spinner while an async action is in progress.
 * Shows the loading text and icon when `isLoading` is true.
 * Supports both className variants and inline styles (e.g., gradient backgrounds).
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Button label text
 * @param {string} props.loadingLabel - Text to show while loading (e.g., 'Verifying...')
 * @param {boolean} props.isLoading - Whether action is in progress
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - Button style variant (primary, secondary, danger, success, warning, outline, light)
 * @param {React.ReactNode} props.icon - Icon to display before label (when not loading)
 * @param {boolean} props.disabled - Additional disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles (for gradients, custom backgrounds, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.block - Block display (full width, same as fullWidth)
 * @param {string} props.type - Button type (button, submit, reset)
 * 
 * @example
 * // With variant
 * <ButtonWithLoader
 *   label="Sign In"
 *   loadingLabel="Signing in..."
 *   isLoading={isLoading}
 *   onClick={handleLogin}
 *   variant="primary"
 *   fullWidth
 * />
 * 
 * // With gradient style
 * <ButtonWithLoader
 *   label="Send Reset Link"
 *   loadingLabel="Sending..."
 *   isLoading={isLoading}
 *   onClick={handleSend}
 *   style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}
 *   fullWidth
 * />
 */
const ButtonWithLoader = ({
  label,
  loadingLabel = 'Processing...',
  isLoading = false,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  className = '',
  style = {},
  size = 'md',
  fullWidth = false,
  block = false,
  type = 'button',
  ...rest
}) => {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  };

  // Define size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const widthClass = fullWidth || block ? 'w-full' : '';

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg font-semibold
    transition-all duration-200
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClass}
    ${sizeClass}
    ${widthClass}
    ${className}
  `;

  // Inline spinner SVG
  const spinnerSVG = (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={baseClasses}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <>
          {spinnerSVG}
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {Icon && <span>{Icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default ButtonWithLoader;
