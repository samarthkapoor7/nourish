import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_REASONING = [
  "Prioritized meals with 30g+ protein to hit today's target with 4 meals.",
  'Filtered out anything over ₹350 to stay under your daily budget.',
  'Balanced dinner toward lighter carbs since lunch already covered your quota.',
];

export function AiExplanationPanel() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="text-primary size-4" />
        <CardTitle className="text-sm font-medium">Why these meals?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {MOCK_REASONING.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="text-primary">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
