import { MetricCard } from '@/components/MetricCard';
import { ReportMetrics } from '@/lib/api';
import {
  Target,
  Star,
  Shield,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react';

interface ReportMetricsGridProps {
  metrics: ReportMetrics;
}

function percent(value: number | null) {
  if (value === null || value === undefined) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

function number(value: number | null, decimals = 2) {
  if (value === null || value === undefined) return '—';
  return value.toFixed(decimals);
}

function accuracyVariant(value: number | null) {
  if (value === null) return 'default';
  if (value >= 0.8) return 'success';
  if (value >= 0.5) return 'warning';
  return 'destructive';
}

function failureVariant(value: number | null) {
  if (value === null) return 'default';
  if (value <= 0.05) return 'success';
  if (value <= 0.15) return 'warning';
  return 'destructive';
}

export function ReportMetricsGrid({ metrics }: ReportMetricsGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {metrics.model_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Dataset: {metrics.dataset} • Run ID: {metrics.run_id}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Exact Match Accuracy"
          value={percent(metrics.exact_match_accuracy)}
          subtitle="Percentage of exact matches"
          icon={Target}
          variant={accuracyVariant(metrics.exact_match_accuracy)}
        />

        <MetricCard
          title="Average Judge Score"
          value={number(metrics.average_judge_score, 2)}
          subtitle="Mean score from judge model"
          icon={Star}
          variant={
            metrics.average_judge_score === null
              ? 'default'
              : accuracyVariant(metrics.average_judge_score / 5)
          }
        />

        <MetricCard
          title="Judge Coverage"
          value={percent(metrics.judge_coverage)}
          subtitle="Responses evaluated by judge"
          icon={Shield}
          variant={accuracyVariant(metrics.judge_coverage)}
        />

        <MetricCard
          title="Model Failure Rate"
          value={percent(metrics.model_failure_rate)}
          subtitle="Rate of model failures"
          icon={AlertTriangle}
          variant={failureVariant(metrics.model_failure_rate)}
        />

        <MetricCard
          title="High Disagreement Rate"
          value={percent(metrics.high_disagreement_rate)}
          subtitle="Judge-human disagreement"
          icon={TrendingDown}
          variant={failureVariant(metrics.high_disagreement_rate)}
        />
      </div>
    </div>
  );
}
