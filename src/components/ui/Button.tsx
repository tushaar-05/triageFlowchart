import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1E3A8A] text-white font-semibold btn-primary shadow-sm ' +
    'focus-visible:outline-[#1E3A8A]',
  ghost:
    'bg-transparent text-[#1E3A8A] font-medium btn-ghost border border-transparent ' +
    'focus-visible:outline-[#1E3A8A]',
  outline:
    'bg-white text-[#1E3A8A] font-medium border border-[#1E3A8A]/30 ' +
    'hover:border-[#1E3A8A]/60 hover:bg-[#EFF6FF] transition-colors duration-200 ' +
    'focus-visible:outline-[#1E3A8A]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      className={`
        inline-flex items-center justify-center gap-2
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <svg
          className="w-4 h-4 animate-spin flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
