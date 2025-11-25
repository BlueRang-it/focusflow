"use client";

import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ children, className, hoverable = false }: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-md p-6",
        hoverable && "hover:shadow-lg transition-shadow cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = ({
  title,
  subtitle,
  action,
}: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={clsx("text-gray-700", className)}>{children}</div>;
};
