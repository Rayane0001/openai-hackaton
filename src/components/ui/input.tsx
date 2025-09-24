// @file src/components/ui/input.tsx
// Form input with proper styling

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
                                className,
                                label,
                                error,
                                id,
                                ...props
                              }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
      <div className="space-y-2">
        {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
        )}
        <input
            id={inputId}
            className={cn(
                "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                "placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                className
            )}
            {...props}
        />
        {error && (
            <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
  );
}