import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportMetricsGrid } from '@/components/ReportMetricsGrid';
import { api, ReportMetrics } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { FileText, Search, Loader2 } from 'lucide-react';

export default function ReportPage() {
  const [runId, setRunId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportMetrics | null>(null);

  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!runId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a Run ID',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setReport(null);

    try {
      const data = await api.getReport(runId.trim());
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      toast({
        title: 'Report Not Found',
        description: 'Could not find a report with that Run ID',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Evaluation Report
            </h1>
            <p className="text-sm text-muted-foreground">
              View detailed metrics for a completed evaluation
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleFetchReport} className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="runId" className="sr-only">
            Run ID
          </Label>
          <Input
            id="runId"
            type="text"
            placeholder="Enter Run ID (e.g., eval-abc123)"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
            className="h-11 bg-background border-input focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !runId.trim()}
          className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Fetch Report
            </>
          )}
        </Button>
      </form>

      {/* Report Content */}
      {report && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ReportMetricsGrid metrics={report} />
        </div>
      )}

      {/* Empty State */}
      {!report && !isLoading && (
        <div className="text-center py-16 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              No report loaded
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Enter a Run ID above to view the evaluation metrics for that run.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
