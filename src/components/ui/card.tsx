// @file src/components/ui/card.tsx
// Flexible card component for content containers

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export default function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
      <div
          className={cn(
              "rounded-xl border bg-white p-6 shadow-sm",
              hover && "transition-shadow hover:shadow-md cursor-pointer",
              className
          )}
          {...props}
      >
        {children}
      </div>
  );
}