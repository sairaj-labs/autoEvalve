import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { api, CompareResponse } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { GitCompare, Loader2, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const [baselineRunId, setBaselineRunId] = useState('');
  const [candidateRunId, setCandidateRunId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!baselineRunId.trim() || !candidateRunId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both Run IDs',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setComparison(null);

    try {
      const data = await api.compare({
        baseline_run_id: baselineRunId.trim(),
        candidate_run_id: candidateRunId.trim(),
      });
      setComparison(data);
    } catch (error) {
      console.error('Comparison failed:', error);
      toast({
        title: 'Comparison Failed',
        description: 'Could not compare the runs. Please check the Run IDs.',
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
            <GitCompare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Compare Runs
            </h1>
            <p className="text-sm text-muted-foreground">
              Compare metrics between a baseline and candidate evaluation
            </p>
          </div>
        </div>
      </div>

      {/* Compare Form */}
      <form onSubmit={handleCompare} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="baseline" className="text-sm font-medium">
              Baseline Run ID
            </Label>
            <Input
              id="baseline"
              type="text"
              placeholder="e.g., eval-baseline-123"
              value={baselineRunId}
              onChange={(e) => setBaselineRunId(e.target.value)}
              className="h-11 bg-background border-input focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate" className="text-sm font-medium">
              Candidate Run ID
            </Label>
            <Input
              id="candidate"
              type="text"
              placeholder="e.g., eval-candidate-456"
              value={candidateRunId}
              onChange={(e) => setCandidateRunId(e.target.value)}
              className="h-11 bg-background border-input focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !baselineRunId.trim() || !candidateRunId.trim()}
          className="w-full sm:w-auto h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <GitCompare className="mr-2 h-4 w-4" />
              Compare Runs
            </>
          )}
        </Button>
      </form>

      {/* Comparison Results */}
      {comparison && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ComparisonSummary comparison={comparison} />
        </div>
      )}

      {/* Empty State */}
      {!comparison && !isLoading && (
        <div className="text-center py-16 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Ready to compare
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Enter a baseline and candidate Run ID to compare their evaluation metrics and detect regressions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
