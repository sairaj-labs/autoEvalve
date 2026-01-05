import { RunEvaluationForm } from '@/components/RunEvaluationForm';
import { FlaskConical } from 'lucide-react';

export default function EvaluatePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Run Evaluation
            </h1>
            <p className="text-sm text-muted-foreground">
              Evaluate an LLM against a benchmark dataset
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <RunEvaluationForm />
      </div>

      {/* Help Text */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Select a dataset and model to start the evaluation process.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Evaluation results will be available in the Report page using the generated Run ID.
        </p>
      </div>
    </div>
  );
}
