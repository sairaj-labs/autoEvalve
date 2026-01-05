import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Play, CheckCircle2 } from 'lucide-react';
import { api, EvaluateRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const DATASETS = [
  { value: 'gsm8k', label: 'GSM8K', description: 'Math word problems' },
  { value: 'truthfulqa', label: 'TruthfulQA', description: 'Truthfulness evaluation' },
  { value: 'safety', label: 'Safety', description: 'Safety benchmarks' },
];

interface RunEvaluationFormProps {
  onSuccess?: (runId: string) => void;
}

export function RunEvaluationForm({ onSuccess }: RunEvaluationFormProps) {
  const [dataset, setDataset] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataset || !modelName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setRunId(null);

    try {
      const request: EvaluateRequest = {
        dataset,
        model_name: modelName.trim(),
      };

      const response = await api.evaluate(request);
      setRunId(response.run_id);
      onSuccess?.(response.run_id);
      
      toast({
        title: 'Evaluation Started',
        description: `Run ID: ${response.run_id}`,
      });
    } catch (error) {
      console.error('Evaluation failed:', error);
      toast({
        title: 'Evaluation Failed',
        description: 'Could not start evaluation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataset" className="text-sm font-medium">
            Dataset
          </Label>
          <Select value={dataset} onValueChange={setDataset}>
            <SelectTrigger
              id="dataset"
              className="h-11 bg-background border-input focus:ring-2 focus:ring-primary/20"
            >
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {DATASETS.map((ds) => (
                <SelectItem
                  key={ds.value}
                  value={ds.value}
                  className="focus:bg-accent cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{ds.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {ds.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model Name
          </Label>
          <Input
            id="model"
            type="text"
            placeholder="e.g., gpt-4, claude-3-opus, llama-3-70b"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="h-11 bg-background border-input focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !dataset || !modelName.trim()}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Starting Evaluation...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Run Evaluation
          </>
        )}
      </Button>

      {runId && (
        <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium text-success">Evaluation Started</p>
              <p className="text-xs text-muted-foreground mt-1">
                Run ID: <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">{runId}</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
