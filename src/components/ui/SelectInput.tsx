import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: SelectOption[];
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  icon,
  options,
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
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            {icon}
          </span>
        )}

        <select
          id={id}
          className={`
            w-full h-11 rounded-lg border border-slate-200 bg-white
            text-sm text-slate-800 appearance-none cursor-pointer
            ${icon ? 'pl-10' : 'pl-4'} pr-10
            input-focus
            ${className}
          `}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown chevron */}
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectInput;
