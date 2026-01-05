import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'border-border',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  destructive: 'border-destructive/30 bg-destructive/5',
};

const iconVariantStyles = {
  default: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  destructive: 'text-destructive bg-destructive/10',
};

function formatValue(value: string | number | null) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toFixed(2);
  return value;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-6 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        'animate-fade-in',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              'rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110',
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
