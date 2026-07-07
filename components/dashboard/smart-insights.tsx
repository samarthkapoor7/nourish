'use client';

import { MOCK_INSIGHTS } from '@/constants/mock-data';

export function SmartInsights() {
  return (
    <section className="animate-fade-in-up stagger-6 space-y-4">
      <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
        Smart Insights
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_INSIGHTS.map((insight, i) => (
          <div
            key={insight.id}
            className="dashboard-card-lift p-5"
            style={{ animationDelay: `${0.3 + i * 0.05}s` }}
          >
            <p className="mt-3 text-sm leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
