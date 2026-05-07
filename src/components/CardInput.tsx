interface CardInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  maxLength?: number;
}

export const CardInput = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  maxLength,
}: CardInputProps) => {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-slate-600">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`px-4 py-2.5 border rounded-lg text-slate-900 focus:ring-2 outline-none transition-all ${
          error
            ? "border-red-300 focus:ring-red-500 bg-red-50"
            : "border-slate-200 focus:ring-blue-500 bg-white"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
