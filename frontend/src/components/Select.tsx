import { type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export default function Select({
  label,
  options,
  placeholder,
  className = "",
  id,
  ...rest
}: SelectProps) {
  const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="font-body font-semibold text-small text-gray-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`
          font-body text-body px-4 py-3 rounded-input border-2 border-gray-200
          bg-white text-gray-800
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-all duration-150
          ${className}
        `.trim()}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
