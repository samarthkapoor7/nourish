const INSIGHTS = [
  'Protein intake is up 18% this week.',
  'You have stayed under budget for 5 days.',
  'Your healthier meal acceptance is higher than last month.',
];

export function SmartInsights() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Smart insights</h2>
        <p className="text-muted-foreground text-sm">Positive trends from your recent meals.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {INSIGHTS.map((insight) => (
          <div key={insight} className="bg-card rounded-xl p-4 ring-1 ring-white/6">
            <p className="text-sm leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
