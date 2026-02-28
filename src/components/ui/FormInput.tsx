import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  icon,
  rightElement,
  error,
  className = '',
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 tracking-wide"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={id}
          className={`
            w-full h-11 rounded-lg border border-slate-200 bg-white
            text-sm text-slate-800 placeholder-slate-400
            ${icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-11' : 'pr-4'}
            input-focus
            ${error ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''}
            ${className}
          `}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          {...rest}
        />

        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {rightElement}
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
