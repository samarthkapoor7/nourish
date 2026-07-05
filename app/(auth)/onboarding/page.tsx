import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Lose weight', description: 'Calorie deficit, high protein' },
  { value: 'maintain', label: 'Maintain', description: 'Stay steady, balanced macros' },
  { value: 'gain_muscle', label: 'Gain muscle', description: 'Calorie surplus, high protein' },
];

export default function OnboardingPage() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <p className="text-muted-foreground text-xs font-medium">Step 1 of 3</p>
        <CardTitle className="text-xl">What&apos;s your goal?</CardTitle>
        <CardDescription>This shapes every meal Nourish recommends.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue="maintain" className="space-y-3">
          {GOAL_OPTIONS.map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="border-border/60 hover:bg-accent/50 has-[[data-state=checked]]:border-primary/60 has-[[data-state=checked]]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-muted-foreground text-xs">{option.description}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="calories">Daily calories</Label>
            <Input id="calories" placeholder="2,200" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Daily budget</Label>
            <Input id="budget" placeholder="₹600" disabled />
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard">Continue</Link>
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
