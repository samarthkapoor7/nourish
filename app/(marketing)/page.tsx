import Link from 'next/link';
import { ArrowRight, Flame, Wallet, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Flame,
    title: 'Calories & macros, tracked automatically',
    description:
      'Set your goal once. Every recommended meal is scored against your calorie and protein targets.',
  },
  {
    icon: Wallet,
    title: 'Budget-aware ordering',
    description: 'Nourish only surfaces meals that fit what you want to spend, every single day.',
  },
  {
    icon: Zap,
    title: 'Effortless ordering',
    description: 'From goal to checkout in a few taps, powered by restaurants already near you.',
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-6 pt-24 pb-20 sm:pt-32">
        <div
          className="from-primary/25 pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[100px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="border-border/60 bg-card/60 text-muted-foreground mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium">
            AI nutrition planning, meet effortless ordering
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Tell Nourish your nutrition goal once.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg text-pretty">
            Nourish helps you discover meals from nearby restaurants, optimize calories, protein,
            and budget, then makes ordering effortless.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">See a live demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-border/60 bg-card/50">
              <CardHeader>
                <span className="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-xl">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="text-base font-medium">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
