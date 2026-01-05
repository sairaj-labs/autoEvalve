import { cn } from '@/lib/utils';
import { CompareResponse } from '@/lib/api';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface ComparisonSummaryProps {
  comparison: CompareResponse;
}

function formatPercent(value: number | null) {
  if (value === null || value === undefined) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

function formatDelta(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
}

export function ComparisonSummary({ comparison }: ComparisonSummaryProps) {
  const isPassing = comparison.result === 'PASS';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Result Banner */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border p-6',
          isPassing
            ? 'bg-success/10 border-success/30'
            : 'bg-destructive/10 border-destructive/30'
        )}
      >
        <div className="flex items-center gap-4">
          {isPassing ? (
            <CheckCircle2 className="h-10 w-10 text-success" />
          ) : (
            <XCircle className="h-10 w-10 text-destructive" />
          )}
          <div>
            <h3
              className={cn(
                'text-2xl font-bold',
                isPassing ? 'text-success' : 'text-destructive'
              )}
            >
              {comparison.result}
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparing {comparison.baseline_run_id} → {comparison.candidate_run_id}
            </p>
          </div>
        </div>
      </div>

      {/* Blocking Issues */}
      {comparison.blocking_issues.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h4 className="font-semibold text-destructive">Blocking Issues</h4>
          </div>
          <ul className="space-y-2">
            {comparison.blocking_issues.map((issue, index) => (
              <li
                key={index}
                className="text-sm text-destructive/90 flex items-start gap-2"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metric Deltas */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Metric Comparison</h4>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Metric
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Baseline
                </th>
                <th className="text-center px-4 py-3" />
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Candidate
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.metric_deltas.map((delta) => (
                <tr
                  key={delta.metric}
                  className={cn(
                    'transition-colors',
                    delta.is_blocking && 'bg-destructive/5'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {delta.metric
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      {delta.is_blocking && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">
                          Blocking
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right text-sm text-muted-foreground font-mono">
                    {formatPercent(delta.baseline)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                  </td>

                  <td className="px-4 py-3 text-right text-sm text-foreground font-mono">
                    {formatPercent(delta.candidate)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'text-sm font-medium font-mono',
                        delta.delta > 0 && 'text-success',
                        delta.delta < 0 && 'text-destructive',
                        delta.delta === 0 && 'text-muted-foreground'
                      )}
                    >
                      {formatDelta(delta.delta)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
