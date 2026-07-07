export function WhyTheseMeals() {
  const reasons = [
    'High protein',
    'Within your budget',
    'Fast delivery',
    'Balanced through the day',
    'Matches your vegetarian preference',
  ];

  return (
    <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
      <h3 className="text-sm font-semibold">Why these meals?</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {reasons.map((reason) => (
          <li key={reason} className="text-muted-foreground flex items-center gap-2">
            <span className="text-[#22C55E]">✓</span>
            {reason}
          </li>
        ))}
      </ul>
    </section>
  );
}
